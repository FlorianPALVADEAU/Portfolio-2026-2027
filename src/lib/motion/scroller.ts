type Scroller = (top: number) => void;

const nativeScroller: Scroller = (top) => window.scrollTo({ top, behavior: "smooth" });

let current: Scroller = nativeScroller;

/** Lets whatever drives the page scroll take over `scrollToTop`; `null` hands it back to the browser. */
export function setScroller(scroller: Scroller | null) {
  current = scroller ?? nativeScroller;
}

/** Scrolls the page to a position in pixels, through the smooth scroll when there is one. */
export function scrollToTop(top: number) {
  current(top);
}
