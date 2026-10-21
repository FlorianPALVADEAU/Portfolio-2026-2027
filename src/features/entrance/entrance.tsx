"use client";

import { gsap } from "gsap";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { whenIntroOpen } from "@/lib/intro";
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
    if (!element) return;
    if (prefersReducedMotion()) {
      element.dataset.entranceState = "done";
      return;
    }

    const targets = `[${ENTRANCE_ATTRIBUTE}]`;
    const context = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, y: 20 });
    }, element);
    const cancelWait = whenIntroOpen(() =>
      context.add(() => {
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "all",
          onComplete: () => {
            element.dataset.entranceState = "done";
          },
        });
      }),
    );

    return () => {
      cancelWait();
      context.revert();
    };
  }, []);

  return <div ref={root} data-entrance-root {...props} />;
}
