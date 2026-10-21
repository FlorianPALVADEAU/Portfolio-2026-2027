"use client";

import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { jumpToTop, onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { getInternalNavigation, getSamePageTarget } from "@/lib/navigation";

const COVER_SECONDS = 0.45;
const REVEAL_SECONDS = 0.55;
/** A jump lands on a heavy page: the cover is held while it settles, then lifted more slowly. */
const SETTLE_MS = 350;
const JUMP_REVEAL_SECONDS = 1;
/** Reveals anyway if a navigation never lands, so the overlay cannot trap the page. */
const GIVE_UP_MS = 4000;

/**
 * GSAP overlay that covers the page, lets the router navigate, then reveals the new page. A link
 * marked `data-jump` to a section of the current page is covered the same way, and lands at once.
 * Screen readers are informed by the route announcer Next.js renders for every navigation.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const giveUp = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastPathname = useRef(pathname);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!prefersReducedMotion());
    return onReducedMotionChange((reduced) => setEnabled(!reduced));
  }, []);

  useEffect(() => {
    // GSAP reads the inline `translateY(100%)` as pixels, so without this the cover never moved.
    if (overlay.current) gsap.set(overlay.current, { y: 0, yPercent: 100 });
  }, []);

  const reveal = useCallback((seconds = REVEAL_SECONDS) => {
    const element = overlay.current;
    clearTimeout(giveUp.current);
    if (!element) return;
    gsap.to(element, {
      yPercent: -100,
      duration: seconds,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(element, { yPercent: 100 });
        covering.current = false;
      },
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function cover(element: HTMLElement, onCovered: () => void) {
      covering.current = true;
      gsap.to(element, {
        yPercent: 0,
        duration: COVER_SECONDS,
        ease: "power3.inOut",
        onComplete: onCovered,
      });
    }

    function sectionOf(event: MouseEvent, anchor: HTMLAnchorElement): HTMLElement | null {
      if (!anchor.hasAttribute("data-jump")) return null;
      const id = getSamePageTarget(event, anchor, window.location);
      return id ? document.getElementById(id) : null;
    }

    // Captured, so that it runs before the smooth scroll and the router take the click for themselves.
    function onJump(event: MouseEvent) {
      const element = overlay.current;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(element && anchor) || covering.current) return;
      const section = sectionOf(event, anchor);
      if (!section) return;

      // Scrolling there would play every animation on the way past in a blink: cover, land, uncover.
      event.preventDefault();
      event.stopPropagation();
      cover(element, () => {
        const margin = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        jumpToTop(section.getBoundingClientRect().top + window.scrollY - margin);
        giveUp.current = setTimeout(() => reveal(JUMP_REVEAL_SECONDS), SETTLE_MS);
      });
    }

    function onClick(event: MouseEvent) {
      const element = overlay.current;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(element && anchor) || covering.current) return;

      const destination = getInternalNavigation(event, anchor, window.location);
      if (!destination) return;

      event.preventDefault();
      cover(element, () => {
        giveUp.current = setTimeout(() => reveal(), GIVE_UP_MS);
        router.push(destination, { scroll: !anchor.hasAttribute("data-keep-scroll") });
      });
    }

    document.addEventListener("click", onJump, true);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onJump, true);
      document.removeEventListener("click", onClick);
      clearTimeout(giveUp.current);
      if (overlay.current) gsap.killTweensOf(overlay.current);
    };
  }, [enabled, router, reveal]);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;

    if (covering.current) reveal();
  }, [pathname, reveal]);

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-(--z-transition) bg-accent"
      style={{ transform: "translateY(100%)" }}
    />
  );
}
