/** The drawing the cursor shows: the arrow, the Macintosh hand over what can be clicked, or nothing. */
type CursorShape = "arrow" | "hand" | "native";

/** The tag that rides next to the shape, when the area under it has something to say. */
type CursorLabel = "view" | "scroll" | null;

export type CursorTarget = { shape: CursorShape; label: CursorLabel };

/** Areas that want the "view" tag carry `data-cursor="view"`. */
const VIEW_SELECTOR = "[data-cursor='view']";

const TEXT_INPUT_TYPES = ["text", "email", "search", "url", "tel", "password", "number"];

/** Where the system pointer must stay: typing, frames that own their pointer, and modal dialogs. */
const NATIVE_SELECTOR = [
  "dialog",
  "iframe",
  "select",
  "textarea",
  "[contenteditable]:not([contenteditable='false'])",
  "input:not([type])",
  ...TEXT_INPUT_TYPES.map((type) => `input[type='${type}']`),
].join(", ");

const LINK_SELECTOR = [
  "a[href]",
  "button",
  "summary",
  "label",
  "input",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
].join(", ");

/**
 * Picks the cursor for what is under the pointer. The system pointer wins over everything. A
 * marked area keeps its tag even though the link covering it makes the hand appear, while the
 * scroll hint only shows where nothing can be clicked.
 */
export function resolveCursorTarget(target: Element | null, scrollHint: boolean): CursorTarget {
  if (target?.closest(NATIVE_SELECTOR)) return { shape: "native", label: null };
  if (target?.closest(VIEW_SELECTOR)) return { shape: "hand", label: "view" };
  if (target?.closest(LINK_SELECTOR)) return { shape: "hand", label: null };
  return { shape: "arrow", label: scrollHint ? "scroll" : null };
}
