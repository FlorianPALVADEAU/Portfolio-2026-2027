import type { ReactNode } from "react";

/** Marks the part of the page the intro makes inert while the loader covers it. */
export const COVERED_ATTRIBUTE = "data-intro-covered";

/**
 * Holds the whole page, so the intro has one element to mark inert instead of every child of the
 * body. That element is the only one whose attributes may differ from the server's, which is why
 * it alone silences the hydration warning: marking each child would warn on every child React has
 * not hydrated yet. It adds no box of its own, so the body's flex layout is untouched.
 */
export function IntroCover({ children }: { children: ReactNode }) {
  return (
    <div {...{ [COVERED_ATTRIBUTE]: "" }} suppressHydrationWarning className="contents">
      {children}
    </div>
  );
}
