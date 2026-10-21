"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Share of the viewport, from the top, where the card's top edge triggers the text. */
const TEXT_START = "top 78%";
/** The card has finished settling once its top edge is this far up; the footer is taller than that. */
const SETTLE_END = "top 35%";

/**
 * The footer card settles into place as it scrolls in, then its text rises. The settle follows
 * the scroll; the text plays once on its own clock, so scrolling fast neither skips it nor waits
 * on it, and nothing is pinned: the page is never held. Words marked `data-rise-word` slide up
 * from behind their mask, elements marked `data-rise-fade` fade up. Both start hidden only once
 * the script runs, so the footer stays readable without it. Under reduced motion nothing moves.
 */
export function FooterReveal(props: ComponentPropsWithoutRef<"div">) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-rise-word]", element);
      const fades = gsap.utils.toArray<HTMLElement>("[data-rise-fade]", element);
      gsap.set(words, { yPercent: 115 });
      gsap.set(fades, { autoAlpha: 0, y: 24 });

      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: element, start: TEXT_START, once: true },
        })
        .to(words, { yPercent: 0, duration: 1.3, stagger: 0.07 })
        .to(
          fades,
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, clearProps: "transform,visibility" },
          0.35,
        );

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
