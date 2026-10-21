import { prefersReducedMotion } from "@/lib/motion";

const INTRO_OPEN_EVENT = "intro:open";

/**
 * Kept in memory so the intro plays on every full load while the site is in development.
 * Persisting it in `sessionStorage` is what turns it into a once-per-session intro.
 */
let played = false;

export function hasPlayedIntro(): boolean {
  return played;
}

/** Remembers the intro and tells the page it can start its own entrance. */
export function openIntro(): void {
  played = true;
  window.dispatchEvent(new Event(INTRO_OPEN_EVENT));
}

/** Runs `callback` once the intro has opened, or right away when there is no intro to wait for. */
export function whenIntroOpen(callback: () => void): () => void {
  if (played || prefersReducedMotion()) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_OPEN_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_OPEN_EVENT, callback);
}
