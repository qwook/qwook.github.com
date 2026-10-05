import path from "node:path";
import { createLogger, type BuildEnvironmentOptions, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pagesMpaPlugin } from "./pages-mpa.mts";
import { pageAssetsPlugin, type AssetLog } from "./page-assets.mts";
import { staticDirsPlugin } from "./static-dirs.mts";

// page-assets rewrites CSS url(./x.png) to the absolute URL the file is
// published at, which Vite then (correctly) can't find in public/ and warns
// about for every reference.
export const logger = createLogger();
for (const level of ["warn", "warnOnce"] as const) {
  const log = logger[level];
  logger[level] = (msg, options) => {
    if (!msg.includes("didn't resolve at build time")) log(msg, options);
  };
}

/** Dependencies' own direct eval() usage isn't ours to fix. */
export const onLog: NonNullable<NonNullable<BuildEnvironmentOptions["rolldownOptions"]>["onLog"]> = (
  level,
  log,
  handler,
) => {
  if (log.code === "EVAL" && log.id?.includes("node_modules")) return;
  handler(level, log);
};

/** Shared by `vite` (dev) and scripts/build.ts (client build). */
export function siteConfig(
  projectRoot: string,
  options: { only?: string[]; assetLog?: AssetLog } = {},
): UserConfig {
  return {
    appType: "mpa",
    customLogger: logger,
    publicDir: path.join(projectRoot, "public"),
    // Dev-server SSR: let Vite process packages whose CommonJS default
    // export Node would otherwise hand back as a module object. (The
    // production SSR build bundles every dependency; see scripts/build.mts.)
    ssr: { noExternal: ["react-syntax-highlighter"] },
    resolve: {
      alias: { "@": path.join(projectRoot, "src") },
    },
    build: {
      outDir: path.join(projectRoot, "dist"),
      emptyOutDir: true,
      // Keep every asset a real file (as webpack's asset/resource did)
      // rather than inlining small ones as base64.
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 2048,
      rolldownOptions: { onLog },
    },
    plugins: [
      pageAssetsPlugin(projectRoot, { log: options.assetLog }),
      react(),
      pagesMpaPlugin(projectRoot, { only: options.only }),
      staticDirsPlugin(projectRoot),
    ],
  };
}
