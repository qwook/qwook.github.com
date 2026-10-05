import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { STATIC_MARKER, scanPages, type StaticDir } from "./find-pages.mts";
import { serveFile } from "./serve-file.mts";

const IGNORED = new Set([STATIC_MARKER, ".DS_Store"]);

/** Maps a URL path to a file inside one of the STATIC folders, if any. */
function resolveStatic(statics: StaticDir[], urlPath: string): string | null {
  for (const { dir, urlDir } of statics) {
    const prefix = urlDir ? `/${urlDir}` : "";
    if (urlPath !== prefix && !urlPath.startsWith(prefix + "/")) continue;
    const file = path.join(dir, urlPath.slice(prefix.length));
    if (file !== dir && !file.startsWith(dir + path.sep)) continue;
    if (fs.existsSync(file)) return file;
  }
  return null;
}

/**
 * Dev-server side of STATIC folders: their files are served byte-for-byte
 * (no HTML transforms, no module graph), the same as they'll be published.
 */
export function staticDirsPlugin(projectRoot: string): Plugin {
  return {
    name: "static-dirs",
    configureServer(server) {
      const { statics } = scanPages(projectRoot);
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const [rawPath, search] = req.url.split("?");
        const urlPath = decodeURIComponent(rawPath);
        const file = resolveStatic(statics, urlPath);
        if (!file) return next();

        if (fs.statSync(file).isDirectory()) {
          if (!urlPath.endsWith("/")) {
            res.statusCode = 301;
            res.setHeader("Location", `${rawPath}/${search ? `?${search}` : ""}`);
            res.end();
            return;
          }
          const index = path.join(file, "index.html");
          if (!fs.existsSync(index)) return next();
          serveFile(req, res, index);
          return;
        }
        if (IGNORED.has(path.basename(file))) return next();
        serveFile(req, res, file);
      });
    },
  };
}

/** Build side of STATIC folders: copy each one verbatim into outDir. */
export function copyStaticDirs(statics: StaticDir[], outDir: string) {
  for (const { dir, urlDir } of statics) {
    fs.cpSync(dir, path.join(outDir, urlDir), {
      recursive: true,
      filter: (src) => !IGNORED.has(path.basename(src)),
    });
  }
}
