"use client";

import { gsap } from "gsap";
import { useLayoutEffect } from "react";
import { hasPlayedIntro, whenIntroOpen } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";

const TARGETS = "[data-entrance]";
/** Seconds between two elements, in page order; short, so the whole entrance stays quick. */
const STAGGER = 0.07;

/**
 * The page's entrance after the intro: every element marked `data-entrance` rises into place one
 * after the other, with the footer's easing, instead of being there already when the screen parts.
 * They are hidden while the loader covers the page, and nothing is touched when there is no intro
 * to wait for, as on a later visit in the same session, or under reduced motion.
 */
export function IntroEntrance() {
  useLayoutEffect(() => {
    if (hasPlayedIntro() || prefersReducedMotion()) return;

    const targets = gsap.utils.toArray<HTMLElement>(TARGETS);
    if (targets.length === 0) return;

    gsap.set(targets, { autoAlpha: 0, y: 40 });
    const stopWaiting = whenIntroOpen(() => {
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        stagger: STAGGER,
        // A leftover transform would pin fixed descendants to the element instead of the screen.
        onComplete: () => gsap.set(targets, { clearProps: "transform,opacity,visibility" }),
      });
    });

    return () => {
      stopWaiting();
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: "transform,opacity,visibility" });
    };
  }, []);

  return null;
}
