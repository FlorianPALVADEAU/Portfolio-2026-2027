"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Share of the viewport, from the top, where the card's top edge triggers the text. */
const TEXT_START = "top 55%";
/** Seconds between two texts, from the top of the card to the bottom. */
const STAGGER = 0.07;
/** The card has finished settling once its top edge is this far up; the footer is taller than that. */
const SETTLE_END = "top 35%";

/**
 * The footer card settles into place as it scrolls in, then its text rises. The settle follows
 * the scroll; the text plays once on its own clock, so scrolling fast neither skips it nor waits
 * on it, and nothing is pinned: the page is never held. Every text sits in a mask
 * (`data-rise-mask`) and starts below its edge; it slides up from behind it. Nothing is hidden
 * until the script runs, so the footer stays readable without it. Under reduced motion nothing moves.
 */
export function FooterReveal(props: ComponentPropsWithoutRef<"div">) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const masks = gsap.utils.toArray<HTMLElement>("[data-rise-mask]", element);
      const movers = gsap.utils.toArray<HTMLElement>("[data-rise-word]", element);
      // Clipped only while they move, so focus rings and hover effects are never cut off.
      gsap.set(masks, { overflow: "hidden" });
      gsap.set(movers, { yPercent: 110 });

      // Document order is reading order, so the stagger runs from the top of the card to the bottom.
      gsap.to(movers, {
        yPercent: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: STAGGER,
        scrollTrigger: { trigger: element, start: TEXT_START, once: true },
        onComplete: () => gsap.set(masks, { clearProps: "overflow" }),
      });

      gsap.fromTo(
        element,
        { y: 48, scale: 0.95 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: SETTLE_END, scrub: 0.5 },
        },
      );
    }, element);

    return () => context.revert();
  }, []);

  return <div ref={root} {...props} />;
}
