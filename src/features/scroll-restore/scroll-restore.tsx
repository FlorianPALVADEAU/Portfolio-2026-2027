"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { armWorkReturn } from "@/lib/motion";

/** Marks a link that returns to a page whose scroll position was left behind. */
const RESTORE_SCROLL_ATTRIBUTE = "data-restore-scroll";

/** Frames to wait for the page to grow tall enough, since pinned sections measure themselves late. */
const MAX_FRAMES = 90;

function restore(top: number, frame = 0) {
  const reachable = document.documentElement.scrollHeight - window.innerHeight;
  if (reachable >= top - 1 || frame >= MAX_FRAMES) {
    window.scrollTo({ top, behavior: "instant" });
    return;
  }
  requestAnimationFrame(() => restore(top, frame + 1));
}

/**
 * Remembers how far each page was scrolled and puts the visitor back there when they return by the
 * browser's back button or by a link marked with `data-restore-scroll`. Any other navigation
 * starts at the top, as a new page should.
 */
export function ScrollRestore() {
  const pathname = usePathname();
  const positions = useRef(new Map<string, number>());
  const returning = useRef(false);

  useEffect(() => {
    const arm = () => {
      returning.current = true;
      armWorkReturn();
    };
    const remember = () => positions.current.set(window.location.pathname, window.scrollY);
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(`[${RESTORE_SCROLL_ATTRIBUTE}]`))
        arm();
    };
    const onPopState = arm;

    remember();
    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (!returning.current) return;
    returning.current = false;
    const top = positions.current.get(pathname);
    if (top) requestAnimationFrame(() => restore(top));
  }, [pathname]);

  return null;
}
