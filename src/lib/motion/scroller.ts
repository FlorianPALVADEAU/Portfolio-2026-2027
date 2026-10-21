/** `immediate` lands on the position at once instead of gliding there. */
type Scroller = (top: number, immediate: boolean) => void;

const nativeScroller: Scroller = (top, immediate) =>
  window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });

let current: Scroller = nativeScroller;

/** Lets whatever drives the page scroll take over `scrollToTop`; `null` hands it back to the browser. */
export function setScroller(scroller: Scroller | null) {
  current = scroller ?? nativeScroller;
}

/** Scrolls the page to a position in pixels, through the smooth scroll when there is one. */
export function scrollToTop(top: number) {
  current(top, false);
}

/** Puts the page at a position in pixels without gliding, keeping the smooth scroll in step. */
export function jumpToTop(top: number) {
  current(top, true);
}
