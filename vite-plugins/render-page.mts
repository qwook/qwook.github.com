import { createElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";

export const DEFAULT_TITLE = "qwook's Homepage";
export const ROOT_PLACEHOLDER = `<div id="root">Loading... Please wait.</div>`;

/**
 * Runs fn with console output muted: page code logs, and React warns about
 * pre-existing prop mistakes, none of which is actionable in a build log.
 */
export async function quietly<T>(fn: () => T | Promise<T>): Promise<T> {
  const saved = { ...console };
  console.log = console.info = console.warn = console.error = console.debug = () => {};
  try {
    return await fn();
  } finally {
    Object.assign(console, saved);
  }
}

const firstLine = (e: unknown) => (e instanceof Error ? e.message : String(e)).split("\n")[0];

/**
 * Server-renders a page into its HTML shell: Head into <head>, the page's
 * markup into #root (marked so the client hydrates it). Used by both the
 * production build and the dev server.
 *
 * A page can opt out of the markup part with `export const prerender = false`,
 * or keep it but have the client render fresh instead of hydrating with
 * `export const hydrate = false` (for markup the browser's parser rearranges,
 * like <div> inside <p>).
 * If loading or rendering throws under Node, that part falls back to
 * client-only rendering and the problem is returned in `errors`.
 */
export async function renderPage(
  html: string,
  loadModule: () => Promise<Record<string, any>>,
): Promise<{ html: string; errors: string[] }> {
  const errors: string[] = [];

  let mod: Record<string, any> = {};
  try {
    mod = await quietly(loadModule);
  } catch (e) {
    errors.push(`import: ${firstLine(e)}`);
  }

  let head = `<title>${DEFAULT_TITLE}</title>`;
  if (mod.Head) {
    try {
      head = await quietly(() => renderToStaticMarkup(createElement(mod.Head)));
    } catch (e) {
      errors.push(`Head: ${firstLine(e)}`);
    }
  }

  let body: string | null = null;
  if (mod.default && mod.prerender !== false) {
    try {
      body = await quietly(() => renderToString(createElement(mod.default)));
    } catch (e) {
      errors.push(`render: ${firstLine(e)}`);
    }
  }

  // Function replacers, so "$&" and friends in page text stay literal.
  html = html.replace("<!--app-head-->", () => head);
  if (body !== null) {
    const mode = mod.hydrate === false ? "replace" : "hydrate";
    html = html.replace(ROOT_PLACEHOLDER, () => `<div id="root" data-prerendered="${mode}">${body}</div>`);
  }
  return { html, errors };
}
