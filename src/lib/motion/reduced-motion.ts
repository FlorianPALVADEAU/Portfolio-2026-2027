const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** Calls `listener` whenever the preference changes; returns an unsubscribe function. */
export function onReducedMotionChange(listener: (reduced: boolean) => void): () => void {
  const query = window.matchMedia(QUERY);
  const handle = (event: MediaQueryListEvent) => listener(event.matches);
  query.addEventListener("change", handle);
  return () => query.removeEventListener("change", handle);
}
