"use client";

import { gsap } from "gsap";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const ENTRANCE_ATTRIBUTE = "data-entrance";

/**
 * Staggers its `data-entrance` descendants in with GSAP. The page heading is left out on purpose:
 * hiding the largest text would delay the first meaningful paint.
 */
export function Entrance(props: ComponentPropsWithoutRef<"div">) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.from(`[${ENTRANCE_ATTRIBUTE}]`, {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "all",
      });
    }, element);

    return () => context.revert();
  }, []);

  return <div ref={root} {...props} />;
}
