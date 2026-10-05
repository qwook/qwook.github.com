import fs from "node:fs";
import path from "node:path";
import type { EnvironmentModuleNode, Plugin, ViteDevServer } from "vite";
import { PAGE_RE, PAGES_DIR, STATIC_MARKER, scanPages } from "./find-pages.mts";
import { ROOT_PLACEHOLDER, renderPage } from "./render-page.mts";

export const ENTRIES_DIR = ".vite-entries";

/** URLs of every stylesheet imported (transitively) by an SSR-loaded module. */
function collectCss(server: ViteDevServer, file: string): string[] {
  const graph = server.environments.ssr.moduleGraph;
  const urls: string[] = [];
  const seen = new Set<EnvironmentModuleNode>();
  const visit = (mod: EnvironmentModuleNode | undefined) => {
    if (!mod || seen.has(mod)) return;
    seen.add(mod);
    if (mod.id && /\.css$/.test(mod.id)) {
      urls.push(encodeURI(mod.url) + (mod.url.includes("?") ? "&" : "?") + "direct");
    }
    for (const imported of mod.importedModules) visit(imported);
  };
  for (const mod of graph.getModulesByFile(file) ?? []) visit(mod);
  return urls;
}

export interface PagesMpaOptions {
  /** Absolute page files to build; every page when omitted. */
  only?: string[];
}

/**
 * Turns every src/pages/**\/*.page.(tsx|jsx) into its own Vite MPA entry
 * (own HTML document, own JS bundle) so pages stay isolated from each other
 * instead of sharing one SPA bundle. Every page builds to
 * <url>/index.html, so URLs are directory-style (/blogs/chao/).
 *
 * Pages are server-rendered (see render-page.mts): at build time by
 * scripts/build.mts, and per request by the dev server below. The generated
 * bootstrap hydrates that markup, or renders from scratch when a page
 * couldn't be (or opted out of being) server-rendered.
 */
export function pagesMpaPlugin(projectRoot: string, options: PagesMpaOptions = {}): Plugin {
  const entriesRoot = path.join(projectRoot, ENTRIES_DIR);

  return {
    name: "pages-mpa",
    config() {
      let { pages } = scanPages(projectRoot);
      if (options.only) {
        const only = new Set(options.only);
        pages = pages.filter((page) => only.has(page.pageFile));
      }

      fs.rmSync(entriesRoot, { recursive: true, force: true });
      const input: Record<string, string> = {};

      for (const page of pages) {
        const dir = path.join(entriesRoot, page.urlDir);
        fs.mkdirSync(dir, { recursive: true });

        const relImport = path.relative(dir, page.pageFile).split(path.sep).join("/");

        fs.writeFileSync(
          path.join(dir, "main.jsx"),
          [
            `import { createRoot, hydrateRoot } from "react-dom/client";`,
            `import Page from ${JSON.stringify(relImport)};`,
            ``,
            `if (import.meta.env.DEV) {`,
            `  // Stylesheets the dev server linked for the first paint; the CSS`,
            `  // imported above has now been injected by Vite in their place.`,
            `  document.querySelectorAll("link[data-ssr-css]").forEach((link) => link.remove());`,
            `}`,
            ``,
            `const container = document.getElementById("root");`,
            `if (container.dataset.prerendered === "hydrate") {`,
            `  hydrateRoot(container, <Page />);`,
            `} else {`,
            `  // Not server-rendered, or marked "replace": React swaps out whatever`,
            `  // markup is there when it first commits.`,
            `  createRoot(container).render(<Page />);`,
            `}`,
            ``,
          ].join("\n"),
        );

        fs.writeFileSync(
          path.join(dir, "index.html"),
          [
            `<!doctype html>`,
            `<html lang="en">`,
            `  <head>`,
            `    <meta charset="UTF-8" />`,
            `    <meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
            `    <link rel="icon" type="image/gif" href="/favicon.gif" />`,
            `    <!--app-head-->`,
            `  </head>`,
            `  <body>`,
            `    ${ROOT_PLACEHOLDER}`,
            `    <script type="module" src="./main.jsx"></script>`,
            `  </body>`,
            `</html>`,
            ``,
          ].join("\n"),
        );

        input[page.urlDir || "index"] = path.join(dir, "index.html");
      }

      return {
        root: entriesRoot,
        build: { rolldownOptions: { input } },
      };
    },

    configureServer(server) {
      // Adding/removing a page or STATIC folder changes the entry list,
      // which is only computed at startup, so restart to pick it up.
      const pagesRoot = path.join(projectRoot, PAGES_DIR);
      server.watcher.add(pagesRoot);
      const onChange = (file: string) => {
        if (!file.startsWith(pagesRoot)) return;
        const name = path.basename(file);
        if (PAGE_RE.test(name) || name === STATIC_MARKER) server.restart();
      };
      server.watcher.on("add", onChange);
      server.watcher.on("unlink", onChange);

      // Static hosts (GitHub Pages included) 301 a directory-style URL
      // without its trailing slash to the slashed form. Vite's dev server
      // doesn't, so match it here.
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const [urlPath, search = ""] = req.url.split("?");
        if (urlPath.endsWith("/")) return next();
        const candidate = path.join(entriesRoot, decodeURIComponent(urlPath), "index.html");
        if (fs.existsSync(candidate)) {
          res.statusCode = 301;
          res.setHeader("Location", `${urlPath}/${search ? `?${search}` : ""}`);
          res.end();
          return;
        }
        next();
      });

      // Server-render page requests, the same way the build prerenders them.
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET" || !req.url) return next();
        const urlPath = decodeURIComponent(req.url.split("?")[0]).replace(/index\.html$/, "");
        if (!urlPath.endsWith("/")) return next();
        const urlDir = urlPath.slice(1, -1);
        const page = scanPages(projectRoot).pages.find((p) => p.urlDir === urlDir);
        const entryHtml = path.join(entriesRoot, urlDir, "index.html");
        if (!page || !fs.existsSync(entryHtml)) return next();

        try {
          const template = await server.transformIndexHtml(
            req.url,
            fs.readFileSync(entryHtml, "utf8"),
          );
          const rendered = await renderPage(template, () => server.ssrLoadModule(page.pageFile));
          const { errors } = rendered;
          // Link the page's stylesheets so the server-rendered markup is
          // styled before any JS runs (the build does this on its own). The
          // bootstrap drops these once Vite's own HMR-able <style>s are in.
          const links = collectCss(server, page.pageFile)
            .map((url) => `<link rel="stylesheet" href="${url}" data-ssr-css />`)
            .join("");
          const html = rendered.html.replace("</head>", () => `${links}</head>`);
          for (const error of errors) {
            server.config.logger.warn(`[ssr] ${urlPath} renders client-side only (${error})`, {
              timestamp: true,
            });
          }
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (e) {
          next(e);
        }
      });
    },
  };
}
