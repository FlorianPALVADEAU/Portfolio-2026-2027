import type { CursorKind } from "@/lib/cursor";

type Look = {
  width: number;
  height: number;
  /** A solid shape, as opposed to the bare ring a link gets. */
  filled: boolean;
  visible: boolean;
};

/** Sizes in pixels. Every kind morphs into the next one from these numbers alone. */
export const LOOKS: Record<CursorKind, Look> = {
  dot: { width: 10, height: 10, filled: true, visible: true },
  scroll: { width: 112, height: 32, filled: true, visible: true },
  link: { width: 44, height: 44, filled: false, visible: true },
  view: { width: 88, height: 88, filled: true, visible: true },
  native: { width: 10, height: 10, filled: true, visible: false },
};

/** The kinds that carry a label, named after the `data-cursor-label` of the element showing it. */
export const LABELLED: readonly CursorKind[] = ["scroll", "view"];
