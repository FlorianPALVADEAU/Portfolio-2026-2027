const DISTANCE_ATTRIBUTE = "data-scroll-hint-px";
const BOTTOM_ATTRIBUTE = "data-scroll-hint-bottom";

const SCROLL_HINT_SELECTOR = `[${DISTANCE_ATTRIBUTE}]`;

/**
 * Marks a pinned block as one that asks the visitor to keep scrolling: the hint shows from when
 * the block's top reaches the middle of the screen until the block has scrolled `distance`
 * pixels past the top. `bottom` lifts the mobile hint clear of what the block draws there.
 */
export function markScrollHint(block: HTMLElement, distance: number, bottom: string) {
  block.setAttribute(DISTANCE_ATTRIBUTE, String(Math.round(distance)));
  block.setAttribute(BOTTOM_ATTRIBUTE, bottom);
}

export function clearScrollHint(block: HTMLElement) {
  block.removeAttribute(DISTANCE_ATTRIBUTE);
  block.removeAttribute(BOTTOM_ATTRIBUTE);
}

/** The marked block the visitor is in the middle of, if any, with where its hint sits. */
export function activeScrollHint(): { bottom: string } | null {
  for (const block of document.querySelectorAll<HTMLElement>(SCROLL_HINT_SELECTOR)) {
    const { top } = block.getBoundingClientRect();
    if (top < window.innerHeight / 2 && -top < Number(block.getAttribute(DISTANCE_ATTRIBUTE))) {
      return { bottom: block.getAttribute(BOTTOM_ATTRIBUTE) ?? "1rem" };
    }
  }
  return null;
}
