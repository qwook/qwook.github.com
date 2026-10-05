import { useEffect, useState } from "react";

/**
 * Renders its children only in the browser, after hydration. Wrap widgets
 * that depend on window, localStorage or randomness while rendering, since
 * those can't be prerendered (and would mismatch when hydrating).
 */
export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : fallback;
}
