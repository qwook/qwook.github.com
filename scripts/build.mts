// Production build: `pnpm build` (incremental) or `pnpm build --clean`.
//
//  1. Work out which pages need rebuilding, by comparing file hashes against
//     the manifest the previous build left in .build-cache/.
//  2. Client-build just those pages with Vite (one HTML + bundle per page).
//  3. SSR-build the same pages and prerender each one's <head> and markup
//     into its HTML, so the page hydrates instead of rendering from scratch.
//  4. Merge the results into .build-cache/site/, drop outputs no page uses
//     any more, then assemble dist/ from it plus public/ and STATIC folders.
//
// CI keeps .build-cache/ between runs (see .github/workflows/main.yml), so a
// deploy only rebuilds the pages whose sources actually changed.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build, mergeConfig, type Plugin, type Rollup } from "vite";
import react from "@vitejs/plugin-react";
import { scanPages, type PageEntry, type StaticDir } from "../vite-plugins/find-pages.mts";
import { pageAssetsPlugin, type AssetLog } from "../vite-plugins/page-assets.mts";
import { ENTRIES_DIR } from "../vite-plugins/pages-mpa.mts";
import { renderPage } from "../vite-plugins/render-page.mts";
import { logger, onLog, siteConfig } from "../vite-plugins/site-config.mts";
import { copyStaticDirs } from "../vite-plugins/static-dirs.mts";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CACHE_DIR = path.join(projectRoot, ".build-cache");
const SITE_DIR = path.join(CACHE_DIR, "site");
const TMP_CLIENT = path.join(CACHE_DIR, "tmp-client");
const TMP_SSR = path.join(CACHE_DIR, "tmp-ssr");
const MANIFEST_FILE = path.join(CACHE_DIR, "manifest.json");
const DIST = path.join(projectRoot, "dist");
const ENTRIES_ROOT = path.join(projectRoot, ENTRIES_DIR);
const MANIFEST_VERSION = 1;

/** Anything here changing can affect every page, so it forces a full build. */
const CONFIG_INPUTS = [
  "package.json",
  "pnpm-lock.yaml",
  "tsconfig.json",
  "vite.config.mts",
  "vite-plugins",
  "scripts",
];

interface PageRecord {
  /** Source files (project-relative) the page's bundle was built from. */
  deps: string[];
  /** Directories an import.meta.glob in the page scans; new files there count. */
  globDirs: string[];
  /** Files (SITE_DIR-relative) the page needs: its HTML, chunks, CSS, assets. */
  outputs: string[];
}

interface Manifest {
  version: number;
  configHash: string;
  /** Hash of every src/ file outside STATIC folders, at the time of the build. */
  files: Record<string, string>;
  /** Keyed by project-relative page file. */
  pages: Record<string, PageRecord>;
}

const rel = (file: string) => path.relative(projectRoot, file).split(path.sep).join("/");
const sha1 = (data: Buffer | string) => crypto.createHash("sha1").update(data).digest("hex");

function walkFiles(dir: string, skip: (dir: string) => boolean = () => false): string[] {
  if (!fs.existsSync(dir)) return [];
  if (fs.statSync(dir).isFile()) return [dir];
  if (skip(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, skip));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function hashConfig(): string {
  const hash = crypto.createHash("sha1");
  hash.update(String(MANIFEST_VERSION));
  for (const input of CONFIG_INPUTS) {
    for (const file of walkFiles(path.join(projectRoot, input)).sort()) {
      hash.update(rel(file)).update(fs.readFileSync(file));
    }
  }
  return hash.digest("hex");
}

function hashSources(statics: StaticDir[]): Record<string, string> {
  const staticDirs = new Set(statics.map((s) => s.dir));
  const files: Record<string, string> = {};
  for (const file of walkFiles(path.join(projectRoot, "src"), (dir) => staticDirs.has(dir))) {
    files[rel(file)] = sha1(fs.readFileSync(file));
  }
  return files;
}

function readManifest(): Manifest | null {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- planning

const STYLE_RE = /\.(s[ac]ss|css)$/;

function planBuild(
  pages: PageEntry[],
  prev: Manifest | null,
  configHash: string,
  files: Record<string, string>,
  clean: boolean,
): { dirty: PageEntry[]; full: boolean; reason: string } {
  const all = { dirty: pages, full: true };
  if (clean) return { ...all, reason: "--clean" };
  if (!prev || prev.version !== MANIFEST_VERSION) return { ...all, reason: "no previous build" };
  if (prev.configHash !== configHash) return { ...all, reason: "build config or dependencies changed" };

  const changed = new Set<string>();
  const added: string[] = [];
  for (const [file, hash] of Object.entries(files)) {
    if (!(file in prev.files)) added.push(file);
    else if (prev.files[file] !== hash) changed.add(file);
  }
  for (const file of Object.keys(prev.files)) if (!(file in files)) changed.add(file);

  // A changed stylesheet no page lists as a dependency is most likely a Sass
  // partial (pulled in by @use/@import, invisible to the module graph), so
  // we can't tell who uses it. Play it safe.
  const known = new Set(Object.values(prev.pages).flatMap((p) => p.deps));
  const untrackedStyle = [...changed].find((f) => STYLE_RE.test(f) && !known.has(f));
  if (untrackedStyle) return { ...all, reason: `${untrackedStyle} changed and isn't tracked` };

  const dirty = pages.filter((page) => {
    const record = prev.pages[rel(page.pageFile)];
    if (!record) return true;
    if (record.deps.some((dep) => changed.has(dep))) return true;
    return added.some((file) => record.globDirs.some((dir) => file.startsWith(dir + "/")));
  });
  return { dirty, full: false, reason: `${changed.size} changed / ${added.length} added files` };
}

// ---------------------------------------------------------------- client build

/** Records, per page, which source files went in and which output files came out. */
function pageGraphPlugin(
  pagesByUrl: Map<string, PageEntry>,
  assetLog: AssetLog,
  records: Map<string, PageRecord>,
): Plugin {
  const globDirsByModule = new Map<string, string[]>();
  const GLOB_RE = /import\.meta\.glob\(\s*(\[[^\]]*\]|(["'`])[^"'`]*\2)/g;

  const toDep = (id: string): string | null => {
    if (id.startsWith("\0")) return null;
    const file = id.replace(/\?.*$/, "");
    if (!path.isAbsolute(file) || !file.startsWith(projectRoot + path.sep)) return null;
    if (file.includes(`${path.sep}node_modules${path.sep}`) || file.startsWith(ENTRIES_ROOT)) return null;
    return rel(file);
  };

  return {
    name: "page-graph",
    enforce: "pre",

    transform(code, id) {
      if (!code.includes("import.meta.glob")) return null;
      const dirs: string[] = [];
      for (const match of code.matchAll(GLOB_RE)) {
        for (const [, pattern] of match[1].matchAll(/["'`]([^"'`]+)["'`]/g)) {
          if (pattern.startsWith("!")) continue;
          const staticPart = pattern.split("/").filter((_, i, parts) =>
            parts.slice(0, i + 1).every((p) => !/[*?{[]/.test(p)),
          );
          const base = pattern.startsWith("/")
            ? path.join(projectRoot, ...staticPart)
            : path.resolve(path.dirname(id.replace(/\?.*$/, "")), ...staticPart);
          dirs.push(rel(base));
        }
      }
      globDirsByModule.set(id, dirs);
      return null;
    },

    // Runs last so it sees the final bundle (Vite drops CSS-only JS chunks
    // in its own generateBundle).
    generateBundle: { order: "post", handler(_options, bundle) {
      for (const entry of Object.values(bundle)) {
        if (entry.type !== "chunk" || !entry.isEntry || !entry.facadeModuleId?.endsWith(".html")) continue;
        const urlDir = rel(path.dirname(entry.facadeModuleId)).slice(ENTRIES_DIR.length + 1);
        const page = pagesByUrl.get(urlDir);
        if (!page) continue;

        const deps = new Set<string>([rel(page.pageFile)]);
        const globDirs = new Set<string>();
        const outputs = new Set<string>([urlDir ? `${urlDir}/index.html` : "index.html"]);
        const seen = new Set<string>();
        const visit = (chunk: Rollup.OutputChunk) => {
          if (seen.has(chunk.fileName)) return;
          seen.add(chunk.fileName);
          outputs.add(chunk.fileName);
          for (const css of chunk.viteMetadata?.importedCss ?? []) outputs.add(css);
          for (const asset of chunk.viteMetadata?.importedAssets ?? []) outputs.add(asset);
          for (const id of chunk.moduleIds) {
            const dep = toDep(id);
            if (dep) deps.add(dep);
            for (const asset of assetLog.get(id) ?? []) {
              outputs.add(asset.fileName);
              deps.add(rel(asset.source));
            }
            for (const dir of globDirsByModule.get(id) ?? []) globDirs.add(dir);
          }
          for (const imported of [...chunk.imports, ...chunk.dynamicImports]) {
            const next = bundle[imported];
            if (next?.type === "chunk") visit(next);
          }
        };
        visit(entry);

        records.set(rel(page.pageFile), {
          deps: [...deps].sort(),
          globDirs: [...globDirs].sort(),
          outputs: [...outputs].sort(),
        });
      }
    } },
  };
}

async function clientBuild(pages: PageEntry[]): Promise<Map<string, PageRecord>> {
  const assetLog: AssetLog = new Map();
  const records = new Map<string, PageRecord>();
  const pagesByUrl = new Map(pages.map((page) => [page.urlDir, page]));
  await build(
    mergeConfig(siteConfig(projectRoot, { only: pages.map((p) => p.pageFile), assetLog }), {
      configFile: false,
      logLevel: "warn",
      build: { outDir: TMP_CLIENT, emptyOutDir: true, copyPublicDir: false },
      plugins: [pageGraphPlugin(pagesByUrl, assetLog, records)],
    }),
  );
  return records;
}

// ---------------------------------------------------------------- prerender

const SSR_ENTRY = "__page";

async function ssrBuild(pages: PageEntry[]) {
  const input: Record<string, string> = {};
  for (const page of pages) input[path.posix.join(page.urlDir, SSR_ENTRY)] = page.pageFile;
  await build({
    configFile: false,
    root: projectRoot,
    logLevel: "warn",
    publicDir: false,
    plugins: [pageAssetsPlugin(projectRoot, { emit: false }), react()],
    resolve: { alias: { "@": path.join(projectRoot, "src") } },
    customLogger: logger,
    // Bundle dependencies rather than importing them from node_modules at
    // prerender time: several are CommonJS, and Node's interop hands back
    // the module object where the browser build gets the default export.
    // React stays external so pages share the renderer's copy.
    ssr: { noExternal: true, external: ["react", "react-dom"] },
    build: {
      ssr: true,
      outDir: TMP_SSR,
      emptyOutDir: true,
      assetsInlineLimit: 0,
      rolldownOptions: { input, onLog, output: { format: "es", entryFileNames: "[name].mjs" } },
    },
  });
}

/** Server-renders every built page's HTML in place (see render-page.mts). */
async function prerender(pages: PageEntry[]) {
  const failures: string[] = [];
  for (const page of pages) {
    const htmlFile = path.join(TMP_CLIENT, page.urlDir, "index.html");
    const ssrFile = path.join(TMP_SSR, page.urlDir, `${SSR_ENTRY}.mjs`);
    const { html, errors } = await renderPage(fs.readFileSync(htmlFile, "utf8"), () =>
      import(pathToFileURL(ssrFile).href),
    );
    fs.writeFileSync(htmlFile, html);
    for (const error of errors) failures.push(`/${page.urlDir} (${error})`);
  }
  if (failures.length) {
    console.warn(
      `[prerender] ${failures.length} page(s) will render client-side only:\n  ` +
        failures.join("\n  "),
    );
  }
}

// ---------------------------------------------------------------- main

async function main() {
  const clean = process.argv.includes("--clean");
  const started = Date.now();
  const { pages, statics } = scanPages(projectRoot);
  const configHash = hashConfig();
  const files = hashSources(statics);
  const prev = readManifest();
  const plan = planBuild(pages, prev, configHash, files, clean);

  const manifest: Manifest = {
    version: MANIFEST_VERSION,
    configHash,
    files,
    pages: plan.full ? {} : { ...prev!.pages },
  };
  if (plan.full) fs.rmSync(SITE_DIR, { recursive: true, force: true });
  const live = new Set(pages.map((p) => rel(p.pageFile)));
  for (const page of Object.keys(manifest.pages)) if (!live.has(page)) delete manifest.pages[page];

  console.log(
    `[build] ${plan.full ? "full" : "incremental"} build (${plan.reason}): ` +
      `${plan.dirty.length} of ${pages.length} pages to build`,
  );

  if (plan.dirty.length) {
    const records = await clientBuild(plan.dirty);
    await ssrBuild(plan.dirty);
    await prerender(plan.dirty);

    for (const page of plan.dirty) {
      const record = records.get(rel(page.pageFile));
      if (!record) throw new Error(`No build output recorded for ${rel(page.pageFile)}`);
      for (const output of record.outputs) {
        const dest = path.join(SITE_DIR, output);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(path.join(TMP_CLIENT, output), dest);
      }
      manifest.pages[rel(page.pageFile)] = record;
    }
  }

  // Drop outputs that no page references any more (deleted pages, chunks
  // superseded by a rebuild).
  const used = new Set(Object.values(manifest.pages).flatMap((p) => p.outputs));
  let removed = 0;
  for (const file of walkFiles(SITE_DIR)) {
    if (!used.has(path.relative(SITE_DIR, file).split(path.sep).join("/"))) {
      fs.rmSync(file);
      removed++;
    }
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.cpSync(SITE_DIR, DIST, { recursive: true });
  fs.cpSync(path.join(projectRoot, "public"), DIST, { recursive: true });
  copyStaticDirs(statics, DIST);

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest));
  fs.rmSync(TMP_CLIENT, { recursive: true, force: true });
  fs.rmSync(TMP_SSR, { recursive: true, force: true });
  fs.rmSync(ENTRIES_ROOT, { recursive: true, force: true });

  console.log(
    `[build] done in ${((Date.now() - started) / 1000).toFixed(1)}s ` +
      `(${removed} stale output file(s) removed) -> ${rel(DIST)}/`,
  );
  // Some page modules start timers at import time during prerendering.
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
