# Henry's Personal Home Page

Source for [qwook.io](https://qwook.io). React + Vite + pnpm.

- Develop: `pnpm dev`
- Build: `pnpm build` (incremental), or `pnpm build:clean` for a full rebuild
- Preview the build: `pnpm preview`

Pushing to `main` builds and deploys to GitHub Pages
(`.github/workflows/main.yml`).

## Pages

Every `*.page.jsx` (or `.page.tsx`) under `src/pages/` is its own HTML page with
its own bundle. The URL mirrors the file's path:

```
src/pages/index.page.jsx           -> /
src/pages/blogs/chao.page.jsx      -> /blogs/chao/
src/pages/god/index.page.jsx       -> /god/
```

Other files in `src/pages/` are not pages, so a page's components, styles and
images can live right next to it. Shared code lives in `src/common/` (import it
as `@/common/...`).

A page module's default export is the whole page (wrap it in `Layout` for the
nav bar; the home page also passes the pets as `sidebar`). Its optional exports:

```jsx
import Meta from "@/common/layout/Meta";
import Layout from "@/common/layout/Layout";
import poster from "./poster.gif";

// <title> and og: tags.
export function Head() {
  return <Meta title="My page" description="..." image={poster} />;
}

// Server-render the markup, but render fresh in the browser instead of
// hydrating (for markup the HTML parser rearranges, like <div> inside <p>).
export const hydrate = false;

// Don't server-render the markup at all (Head is still rendered).
export const prerender = false;

export default function Root() {
  return <Layout>...</Layout>;
}
```

Pages are server-rendered both in `pnpm dev` and in the build, then hydrated in
the browser. Code that needs `window`, `localStorage` or randomness while
rendering should run in an effect or sit inside
`@/common/components/ClientOnly`.

Images, audio, video and fonts imported from inside `src/pages/` are published
at the same path, e.g. `src/pages/blogs/chao/IMG_1646.jpg` is served at
`/blogs/chao/IMG_1646.jpg`. Assets imported from `src/common/` get hashed
`/assets/...` names.

## Static folders

A folder containing an empty file named `STATIC` is published byte-for-byte at
its path, with no page processing (e.g. `src/pages/archive/` -> `/archive/`).

A folder named in parentheses, like `(projects)`, is left out of the URL. That
is how the HTML Day projects in `src/pages/events/htmlday2025/(projects)/`
are published at `/events/htmlday2025/~name/`, next to that event's pages.

## Incremental builds

`scripts/build.mts` records which source files went into each page in
`.build-cache/manifest.json`. On the next build it rebuilds only the pages
whose dependencies changed and reuses everything else from `.build-cache/site/`.
A change to `package.json`, the lockfile, `vite-plugins/` or `scripts/` forces a
full rebuild. CI keeps `.build-cache/` between runs with `actions/cache`.
