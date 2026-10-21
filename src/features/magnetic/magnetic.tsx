"use client";

import { gsap } from "gsap";
import { type ReactNode, useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  /** Share of the pointer's distance from the centre that the element follows. */
  strength?: number;
};

/**
 * Leans its child toward the pointer while it hovers and lets it settle back on leave. Only for
 * a mouse or trackpad: a touch screen has no hover to lean toward.
 */
export function Magnetic({ children, strength = 0.35 }: MagneticProps) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion() || !hasFinePointer()) return;

    const moveX = gsap.quickTo(element, "x", { duration: 0.6, ease: "power3.out" });
    const moveY = gsap.quickTo(element, "y", { duration: 0.6, ease: "power3.out" });

    function follow(event: PointerEvent) {
      if (!element) return;
      const box = element.getBoundingClientRect();
      // The box already carries the current offset; remove it so the centre does not run away.
      const centreX = box.left + box.width / 2 - Number(gsap.getProperty(element, "x"));
      const centreY = box.top + box.height / 2 - Number(gsap.getProperty(element, "y"));
      moveX((event.clientX - centreX) * strength);
      moveY((event.clientY - centreY) * strength);
    }
    function settle() {
      moveX(0);
      moveY(0);
    }

    element.addEventListener("pointermove", follow);
    element.addEventListener("pointerleave", settle);
    return () => {
      element.removeEventListener("pointermove", follow);
      element.removeEventListener("pointerleave", settle);
      gsap.set(element, { clearProps: "transform" });
    };
  }, [strength]);

  return (
    <span ref={root} className="inline-block">
      {children}
    </span>
  );
}
