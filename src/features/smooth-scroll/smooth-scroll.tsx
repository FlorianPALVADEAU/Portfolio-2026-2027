"use client";

import { gsap } from "gsap";
import Lenis from "lenis";
import { useEffect } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";

/** Gentle inertia: a high lerp keeps the scroll close to native and never lags behind the input. */
const LERP = 0.14;

function start(): () => void {
  const lenis = new Lenis({ autoRaf: false, lerp: LERP, anchors: true });
  const tick = (time: number) => lenis.raf(time * 1000);

  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
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
