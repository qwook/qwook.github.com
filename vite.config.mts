import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { siteConfig } from "./vite-plugins/site-config.mts";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Used by `pnpm dev`. Production builds go through scripts/build.mts, which
// reuses siteConfig and adds prerendering, STATIC folders and caching.
export default defineConfig(siteConfig(projectRoot));
