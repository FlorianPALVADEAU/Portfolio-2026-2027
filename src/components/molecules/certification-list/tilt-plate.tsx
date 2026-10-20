"use client";

import { gsap } from "gsap";
import { type ReactNode, useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type TiltPlateProps = {
  className?: string;
  children: ReactNode;
};

const MAX_TILT_DEG = 9;

/**
 * Turns toward the pointer like a plate held in the hand, with a glare that slides across it.
 * Touch screens and reduced motion get a still plate.
 */
export function TiltPlate({ className, children }: TiltPlateProps) {
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = plate.current;
    if (!element || prefersReducedMotion() || !hasFinePointer()) return;

    gsap.set(element, { "--gx": "50%", "--gy": "0%" });
    const options = { duration: 0.5, ease: "power3.out" };
    const turnX = gsap.quickTo(element, "rotationX", options);
    const turnY = gsap.quickTo(element, "rotationY", options);
    const glareX = gsap.quickTo(element, "--gx", options);
    const glareY = gsap.quickTo(element, "--gy", options);

    const aim = (shareX: number, shareY: number) => {
      turnY((shareX - 0.5) * 2 * MAX_TILT_DEG);
      turnX(-(shareY - 0.5) * 2 * MAX_TILT_DEG);
      glareX(shareX * 100);
      glareY(shareY * 100);
    };
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect();
      aim((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
    };
    const leave = () => aim(0.5, 0.5);

    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(element);
      gsap.set(element, { clearProps: "transform,--gx,--gy" });
    };
  }, []);

  return (
    <div className="h-full [perspective:900px]">
      <div ref={plate} className={className}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_circle_at_var(--gx,50%)_var(--gy,0%),color-mix(in_oklch,var(--foreground)_14%,transparent),transparent_60%)] opacity-0 transition-opacity duration-(--duration-base) group-hover/plate:opacity-100"
        />
        {children}
      </div>
    </div>
  );
}
