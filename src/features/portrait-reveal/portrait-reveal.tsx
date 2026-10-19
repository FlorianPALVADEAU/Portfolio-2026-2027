"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Viewport heights of scrolling, with the stage held in place, that play the whole reveal. */
const TRAVEL = 1.5;
const TRACK = `${(TRAVEL + 1) * 100}svh`;
/** Radius large enough to make the closed frame a circle, in px so it can tween to the final one. */
const CLOSED_RADIUS = "600px";
const OPEN_RADIUS = "24px";

type PortraitRevealProps = {
  /** Classes of the full-screen stage that holds the children. */
  className?: string;
  children: ReactNode;
};

/**
 * A full-screen stage that stays in place while the visitor scrolls: the element marked
 * `data-portrait-frame` opens from its centre while the picture inside it, marked
 * `data-portrait-image`, settles, then every `data-portrait-line` rises in turn.
 * The previous section must hand over at the start of the stage: this one is transparent for its
 * first viewport and must be pulled up over it. Under reduced motion nothing is held and the
 * whole content is shown at once.
 */
export function PortraitReveal({ className, children }: PortraitRevealProps) {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = track.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: element, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
      timeline.fromTo(
        "[data-portrait-frame]",
        { clipPath: `inset(50% 50% 50% 50% round ${CLOSED_RADIUS})` },
        {
          clipPath: `inset(0% 0% 0% 0% round ${OPEN_RADIUS})`,
          duration: 0.45,
          ease: "power2.inOut",
        },
        0,
      );
      timeline.fromTo("[data-portrait-image]", { scale: 1.4 }, { scale: 1, duration: 0.7 }, 0);
      timeline.fromTo(
        "[data-portrait-line]",
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.22, stagger: 0.08, ease: "power2.out" },
        0.35,
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={track}
      style={{ "--track": TRACK } as CSSProperties}
      className="h-(--track) motion-reduce:h-auto"
    >
      <div
        className={cn("sticky top-0 h-svh motion-reduce:static motion-reduce:h-auto", className)}
      >
        {children}
      </div>
    </div>
  );
}
