"use client";

import { gsap } from "gsap";
import { useLayoutEffect } from "react";
import { hasPlayedIntro, whenIntroOpen } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";
import { COVERED_ATTRIBUTE } from "./intro-cover";

const PENDING = "data-intro-pending";
/** Seconds between two steps; elements sharing a step rise together. */
const STEP = 0.12;

/**
 * The page's entrance after the intro: every element marked `data-intro-step="<step>"` rises into
 * place, lowest step first, with the footer's easing, instead of being there already when the
 * screen parts. The elements are held back by a stylesheet rule keyed on an attribute of the root
 * while the loader covers the page; they carry no inline style until they move, so hydration is
 * never disturbed. Nothing is held when there is no intro to wait for, as on a later visit in the
 * same session, or under reduced motion. The page, held by `IntroCover`, is inert for as long as the loader
 * covers it.
 */
export function IntroEntrance() {
  useLayoutEffect(() => {
    if (hasPlayedIntro() || prefersReducedMotion()) return;

    const root = document.documentElement;
    root.setAttribute(PENDING, "");
    // The loader covers the page, so the page must not be reachable by keyboard or screen reader
    // behind it. It is released only if it was not inert already.
    const page = document.querySelector<HTMLElement>(`[${COVERED_ATTRIBUTE}]`);
    const covered = page && !page.hasAttribute("inert") ? page : null;
    covered?.setAttribute("inert", "");
    const release = () => {
      root.removeAttribute(PENDING);
      covered?.removeAttribute("inert");
    };

    const stopWaiting = whenIntroOpen(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-intro-step]");
      for (const target of targets) {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: Number(target.dataset.introStep) * STEP,
            // A leftover transform would pin fixed descendants to the element instead of the screen.
            onComplete: () => gsap.set(target, { clearProps: "transform,opacity,visibility" }),
          },
        );
      }
      // The tweens above set their inline start state at once, so the rule is no longer needed.
      release();
    });

    return () => {
      stopWaiting();
      release();
      gsap.killTweensOf("[data-intro-step]");
      gsap.set("[data-intro-step]", { clearProps: "transform,opacity,visibility" });
    };
  }, []);

  return null;
}
