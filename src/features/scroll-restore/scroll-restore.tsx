"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { armWorkReturn, jumpToTop, rememberLeftWork } from "@/lib/motion";

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

/** Milliseconds a shared address keeps pulling the page to its section while the layout settles. */
const HASH_SETTLE_MS = 2500;

/** Keeps the section named by the address in place until the visitor takes over or it settles. */
function holdHashTarget(): () => void {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return () => {};
  const started = performance.now();
  let frame = 0;
  const align = () => {
    const target = document.getElementById(id);
    if (target) {
      const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const top = target.getBoundingClientRect().top - margin;
      if (Math.abs(top) > 1) jumpToTop(top + window.scrollY);
    }
    if (performance.now() - started < HASH_SETTLE_MS) frame = requestAnimationFrame(align);
  };
  const release = () => cancelAnimationFrame(frame);
  const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  for (const name of events) window.addEventListener(name, release, { once: true, passive: true });
  align();
  return () => {
    release();
    for (const name of events) window.removeEventListener(name, release);
  };
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
  const shown = useRef(pathname);

  useEffect(() => {
    const arm = () => {
      returning.current = true;
      armWorkReturn();
    };
    // The address changes before the page does, and a page that was just swapped in starts at the
    // top: neither moment says where the visitor was, so neither is written down.
    const remember = () => {
      if (returning.current || window.location.pathname !== shown.current) return;
      positions.current.set(shown.current, window.scrollY);
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(`[${RESTORE_SCROLL_ATTRIBUTE}]`))
        arm();
    };
    const onPopState = arm;

    const releaseHash = holdHashTarget();
    remember();
    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick, true);
    return () => {
      releaseHash();
      window.removeEventListener("scroll", remember);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    shown.current = pathname;
    // A project reached from another project (the next step of a story) is the one the list
    // must bring the visitor back to, not the cover that was clicked first.
    if (/\/projects\/[^/]+$/.test(pathname)) rememberLeftWork(pathname);
    if (!returning.current) return;
    returning.current = false;
    const top = positions.current.get(pathname);
    if (top) requestAnimationFrame(() => restore(top));
  }, [pathname]);

  return null;
}
