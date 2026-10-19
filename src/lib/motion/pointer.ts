const QUERY = "(hover: hover) and (pointer: fine)";

/** A mouse or trackpad that can hover, as opposed to a touch screen. */
export function hasFinePointer(): boolean {
  return window.matchMedia(QUERY).matches;
}
