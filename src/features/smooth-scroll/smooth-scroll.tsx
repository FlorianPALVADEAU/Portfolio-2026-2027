"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import {
  NATIVE_SCROLL_ATTRIBUTE,
  onReducedMotionChange,
  prefersReducedMotion,
  SMALL_SCREEN_QUERY,
  setScroller,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);
// The browser bar sliding in and out resizes the viewport on a phone; without this every trigger
// re-measures on each slide and the page jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

/** Gentle inertia: a high lerp keeps the scroll close to native and never lags behind the input. */
const LERP = 0.14;
const SCROLL_TO_SECONDS = 1;
/** A lerp of 1 reaches the target at once: the scroll is as native as Lenis can make it. */
const NATIVE_LERP = 1;

/**
 * A snap that has to land on a frame fights an inertia that is still gliding, so on a small screen
 * smoothing is switched off while a block marked for native scroll is in view.
 */
function yieldToNativeScroll(lenis: Lenis): () => void {
  if (!window.matchMedia(SMALL_SCREEN_QUERY).matches) return () => {};
  // Looked up on every scroll, since the block may mount after this does.
  const update = () => {
    const inView = Array.from(document.querySelectorAll(`[${NATIVE_SCROLL_ATTRIBUTE}]`)).some(
      (block) => {
        const { top, bottom } = block.getBoundingClientRect();
        return top < window.innerHeight && bottom > 0;
      },
    );
    lenis.options.lerp = inView ? NATIVE_LERP : LERP;
  };
  return lenis.on("scroll", update);
}

function start(): () => void {
  const lenis: Lenis = new Lenis({
    autoRaf: false,
    lerp: LERP,
    anchors: true,
    // A page can be moved from outside (returning to a card, an address with a hash) without
    // Lenis noticing; its next wheel step would then start from where it believes the page is.
    virtualScroll: () => {
      if (lenis.isScrolling !== "smooth" && Math.abs(lenis.actualScroll - lenis.animatedScroll) > 1)
        lenis.scrollTo(lenis.actualScroll, { immediate: true, force: true });
      return true;
    },
  });
  const tick = (time: number) => lenis.raf(time * 1000);
  const release = yieldToNativeScroll(lenis);
  setScroller((top, immediate) =>
    lenis.scrollTo(
      top,
      immediate ? { immediate: true, force: true } : { duration: SCROLL_TO_SECONDS },
    ),
  );

  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    release();
    setScroller(null);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

/** Smooth scrolling driven by the GSAP ticker; disabled while the user prefers reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    let stop = prefersReducedMotion() ? null : start();

    const unsubscribe = onReducedMotionChange((reduced) => {
      stop?.();
      stop = reduced ? null : start();
    });

    return () => {
      unsubscribe();
      stop?.();
    };
  }, []);

  return null;
}
