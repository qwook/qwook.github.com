import fs from "node:fs";
import path from "node:path";
import type { Plugin, Rollup } from "vite";
import { PAGES_DIR, urlPathFor } from "./find-pages.mts";
import { serveFile } from "./serve-file.mts";

export const ASSET_RE =
  /\.(png|jpe?g|gif|webp|svg|ico|avif|bmp|mp3|wav|ogg|mid|mp4|mov|webm|ttf|otf|woff2?|zip|fbx|glb|gltf|hdr|pdf)$/i;
const QUERY_SUFFIX = "?page-asset";
const CSS_ID_RE = /\.css(\?.*)?$/;
const CSS_URL_RE = /url\(\s*(['"]?)(\.\.?\/[^'")]+)\1\s*\)/g;

export interface EmittedAsset {
  /** Absolute path of the source file. */
  source: string;
  /** Output path relative to the build's outDir. */
  fileName: string;
}

/**
 * Which mirrored assets each module emitted, so the incremental build can
 * attribute them to the pages that import that module.
 */
export type AssetLog = Map<string, EmittedAsset[]>;

/**
 * Assets that live next to a page (anywhere under src/pages/) are served at
 * a URL that mirrors their location on disk, e.g.
 *   src/pages/blogs/chao/IMG_1646.jpg -> /blogs/chao/IMG_1646.jpg
 * instead of Vite's default hashed /assets/IMG_1646-abc123.jpg. Handles both
 * JS `import` and CSS `url(./...)` references. Assets imported from outside
 * src/pages (e.g. src/common) keep Vite's default hashed handling.
 */
export function pageAssetsPlugin(
  projectRoot: string,
  options: { emit?: boolean; log?: AssetLog } = {},
): Plugin {
  const pagesRoot = path.join(projectRoot, PAGES_DIR);
  const emit = options.emit ?? true;
  const log = options.log;
  // URL -> file, so the dev server can find mirrored assets again (route
  // groups mean the URL can't always be mapped back by path alone).
  const served = new Map<string, string>();
  let isBuild = false;

  const isPageFile = (file: string) =>
    file.startsWith(pagesRoot + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile();

  function emitAsset(ctx: Rollup.PluginContext, filePath: string): EmittedAsset {
    const fileName = urlPathFor(projectRoot, filePath);
    if (isBuild && emit) {
      ctx.emitFile({ type: "asset", fileName, source: fs.readFileSync(filePath) });
    }
    served.set("/" + fileName, filePath);
    return { source: filePath, fileName };
  }

  return {
    name: "page-assets",
    enforce: "pre",

    config(_config, env) {
      isBuild = env.command === "build";
    },

    resolveId(source, importer) {
      if (!importer || !ASSET_RE.test(source)) return null;
      const resolved = path.isAbsolute(source)
        ? source
        : source.startsWith(".")
          ? path.resolve(path.dirname(importer), source)
          : null;
      if (resolved && isPageFile(resolved)) return resolved + QUERY_SUFFIX;
      return null;
    },

    load(id) {
      if (!id.endsWith(QUERY_SUFFIX)) return null;
      const asset = emitAsset(this, id.slice(0, -QUERY_SUFFIX.length));
      log?.set(id, [asset]);
      return `export default ${JSON.stringify("/" + asset.fileName)};`;
    },

    transform(code, id) {
      if (!CSS_ID_RE.test(id)) return null;
      const file = id.replace(/\?.*$/, "");

      const assets: EmittedAsset[] = [];
      const result = code.replace(CSS_URL_RE, (match, _quote, relativePath) => {
        const clean = relativePath.replace(/[?#].*$/, "");
        if (!ASSET_RE.test(clean)) return match;
        const resolved = path.resolve(path.dirname(file), clean);
        if (!isPageFile(resolved)) return match;
        const asset = emitAsset(this, resolved);
        assets.push(asset);
        return `url(${JSON.stringify("/" + asset.fileName)})`;
      });

      if (!assets.length) return null;
      log?.set(id, assets);
      return { code: result, map: null };
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent(req.url?.split("?")[0] ?? "");
        if (!ASSET_RE.test(url)) return next();
        const file = served.get(url) ?? path.join(pagesRoot, url);
        if (!isPageFile(file)) return next();
        serveFile(req, res, file);
      });
    },
  };
}
