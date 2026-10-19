"use client";

import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { getInternalNavigation } from "@/lib/navigation";

const COVER_SECONDS = 0.45;
const REVEAL_SECONDS = 0.55;
/** Reveals anyway if a navigation never lands, so the overlay cannot trap the page. */
const GIVE_UP_MS = 4000;

/**
 * GSAP overlay that covers the page, lets the router navigate, then reveals the new page.
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

  const reveal = useCallback(() => {
    const element = overlay.current;
    clearTimeout(giveUp.current);
    if (!element) return;
    gsap.to(element, {
      yPercent: -100,
      duration: REVEAL_SECONDS,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(element, { yPercent: 100 });
        covering.current = false;
      },
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function onClick(event: MouseEvent) {
      const element = overlay.current;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!(element && anchor) || covering.current) return;

      const destination = getInternalNavigation(event, anchor, window.location);
      if (!destination) return;

      event.preventDefault();
      covering.current = true;
      gsap.to(element, {
        yPercent: 0,
        duration: COVER_SECONDS,
        ease: "power3.inOut",
        onComplete: () => {
          giveUp.current = setTimeout(reveal, GIVE_UP_MS);
          router.push(destination, { scroll: !anchor.hasAttribute("data-keep-scroll") });
        },
      });
    }

    document.addEventListener("click", onClick);
    return () => {
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
