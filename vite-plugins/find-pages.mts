import fs from "node:fs";
import path from "node:path";

export const PAGES_DIR = "src/pages";
export const PAGE_RE = /\.page\.(tsx|jsx)$/;
/** A folder containing a file with this name is published verbatim. */
export const STATIC_MARKER = "STATIC";

export interface PageEntry {
  /** Absolute path to the *.page.(tsx|jsx) file. */
  pageFile: string;
  /** URL directory this page renders at, e.g. "" | "blogs" | "blogs/chao". */
  urlDir: string;
}

export interface StaticDir {
  /** Absolute path to the folder holding the STATIC marker. */
  dir: string;
  /** URL directory its contents are published at. */
  urlDir: string;
}

/**
 * Folder names wrapped in parentheses, e.g. "(projects)", are route groups:
 * they organize files on disk without adding a segment to the URL.
 */
const isGroup = (segment: string) => /^\(.*\)$/.test(segment);

/** URL path (no leading slash) of any file or folder under src/pages. */
export function urlPathFor(projectRoot: string, file: string): string {
  return path
    .relative(path.join(projectRoot, PAGES_DIR), file)
    .split(path.sep)
    .filter((segment) => segment && !isGroup(segment))
    .join("/");
}

/**
 * Walks src/pages, mapping every *.page.(tsx|jsx) to the URL it is served at
 * and collecting STATIC folders (which are not descended into).
 *
 *   index.page.jsx     -> its folder's URL       (blogs/index.page.jsx -> /blogs/)
 *   chao.page.jsx      -> a named sub-URL        (blogs/chao.page.jsx  -> /blogs/chao/)
 */
export function scanPages(projectRoot: string): {
  pages: PageEntry[];
  statics: StaticDir[];
} {
  const pagesRoot = path.join(projectRoot, PAGES_DIR);
  const pages: PageEntry[] = [];
  const statics: StaticDir[] = [];
  const seen = new Map<string, string>();

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && e.name === STATIC_MARKER)) {
      statics.push({ dir, urlDir: urlPathFor(projectRoot, dir) });
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && PAGE_RE.test(entry.name)) {
        const baseName = entry.name.replace(PAGE_RE, "");
        const dirUrl = urlPathFor(projectRoot, dir);
        const urlDir =
          baseName === "index" ? dirUrl : [dirUrl, baseName].filter(Boolean).join("/");
        const clash = seen.get(urlDir);
        if (clash) {
          throw new Error(`Both ${clash} and ${full} render at /${urlDir}`);
        }
        seen.set(urlDir, full);
        pages.push({ pageFile: full, urlDir });
      }
    }
  }

  if (fs.existsSync(pagesRoot)) walk(pagesRoot);
  pages.sort((a, b) => a.urlDir.localeCompare(b.urlDir));
  return { pages, statics };
}
