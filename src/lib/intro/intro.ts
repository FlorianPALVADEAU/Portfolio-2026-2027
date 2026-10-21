import { prefersReducedMotion } from "@/lib/motion";

const PLAYED_KEY = "intro-played";
const INTRO_OPEN_EVENT = "intro:open";

export function hasPlayedIntro(): boolean {
  try {
    return window.sessionStorage.getItem(PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

/** Remembers the intro for the session and tells the page it can start its own entrance. */
export function openIntro(): void {
  try {
    window.sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Private mode: the intro simply replays on the next full load.
  }
  window.dispatchEvent(new Event(INTRO_OPEN_EVENT));
}

/** Runs `callback` once the intro has opened, or right away when there is no intro to wait for. */
export function whenIntroOpen(callback: () => void): () => void {
  if (hasPlayedIntro() || prefersReducedMotion()) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_OPEN_EVENT, callback, { once: true });
  return () => window.removeEventListener(INTRO_OPEN_EVENT, callback);
}
