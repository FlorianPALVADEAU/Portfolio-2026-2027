/** What the custom cursor currently looks like, from least to most specific context. */
export type CursorKind = "dot" | "scroll" | "link" | "view" | "native";

export type CursorTarget = {
  kind: CursorKind;
  /** The clickable element a `link` cursor gently pulls towards. */
  anchor: Element | null;
};

/** Marks an area that wants the "view" label; mirrored by `data-cursor="view"` in the markup. */
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
 * Picks the cursor look for what is under the pointer. Precedence: the system pointer wins over
 * everything, a marked area wins over the link that covers it, a link wins over the scroll hint.
 */
export function resolveCursorTarget(target: Element | null, scrollHint: boolean): CursorTarget {
  if (target?.closest(NATIVE_SELECTOR)) return { kind: "native", anchor: null };
  if (target?.closest(VIEW_SELECTOR)) return { kind: "view", anchor: null };
  const anchor = target?.closest(LINK_SELECTOR) ?? null;
  if (anchor) return { kind: "link", anchor };
  return { kind: scrollHint ? "scroll" : "dot", anchor: null };
}
