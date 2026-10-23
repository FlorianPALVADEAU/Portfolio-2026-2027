"use client";

import { gsap } from "gsap";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** A block rises once its top edge is this far up the screen, so it is seen arriving. */
const TRIGGER_MARGIN = "0px 0px -12% 0px";
/** Seconds between two texts of the same block, from the top down. */
const STAGGER = 0.07;

/**
 * Plays the footer's rise on each direct child, when that child comes into view: every text
 * inside it (`data-rise-mask`) slides up from behind its own edge, top to bottom. Each block runs
 * on its own, so a long section rises piece by piece as it is scrolled, and nothing is pinned or
 * waited on. Blocks are asked of the browser (`IntersectionObserver`) rather than measured, so
 * late images and fonts cannot make one play before it is seen. Nothing is hidden until the script
 * runs, and under reduced motion nothing moves.
 */
export function RiseReveal({
  triggerMargin = TRIGGER_MARGIN,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  /** `rootMargin` of the observer; a page that never scrolls passes `0px` so its last block rises too. */
  triggerMargin?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const rises = new Map<Element, gsap.core.Tween>();
    const everyMask: HTMLElement[] = [];
    const everyMover: HTMLElement[] = [];

    for (const block of Array.from(element.children)) {
      const masks = gsap.utils.toArray<HTMLElement>("[data-rise-mask]", block);
      const movers = gsap.utils.toArray<HTMLElement>("[data-rise-word]", block);
      if (movers.length === 0) continue;
      everyMask.push(...masks);
      everyMover.push(...movers);
      // Clipped only while they move, so focus rings and hover effects are never cut off.
      gsap.set(masks, { overflow: "hidden" });
      gsap.set(movers, { yPercent: 110 });
      rises.set(
        block,
        gsap.to(movers, {
          yPercent: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: STAGGER,
          paused: true,
          // A leftover transform would pin fixed descendants to the text instead of the screen.
          onComplete: () => {
            gsap.set(masks, { clearProps: "overflow" });
            gsap.set(movers, { clearProps: "transform" });
          },
        }),
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          rises.get(entry.target)?.play();
        }
      },
      { rootMargin: triggerMargin },
    );
    for (const block of rises.keys()) observer.observe(block);

    return () => {
      observer.disconnect();
      for (const rise of rises.values()) rise.kill();
      gsap.set(everyMask, { clearProps: "overflow" });
      gsap.set(everyMover, { clearProps: "transform" });
    };
  }, [triggerMargin]);

  return <div ref={root} {...props} />;
}
