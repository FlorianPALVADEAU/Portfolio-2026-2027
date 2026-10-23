"use client";

import { gsap } from "gsap";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";

type SpinningMarkProps = {
  icon: LucideIcon;
  className?: string;
};

/** Degrees per second when nothing is moving. */
const IDLE_SPEED = 14;
/** Degrees per second added for each pixel the pointer travels in a frame. */
const PUSH = 14;
const MAX_SPEED = 900;
/** Share of the extra speed kept after one second. */
const KEPT_PER_SECOND = 0.12;
const BURST = 700;

/**
 * A mark that turns slowly by itself, spins up when the pointer moves anywhere on the page and
 * bursts into a fast turn when it is pressed, then eases back. Under reduced motion it stands still.
 */
export function SpinningMark({ icon: Glyph, className }: SpinningMarkProps) {
  const mark = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const element = mark.current;
    if (!element || prefersReducedMotion()) return;

    let angle = 0;
    let extra = 0;
    let last: { x: number; y: number } | null = null;

    const move = (event: PointerEvent) => {
      if (last) {
        const distance = Math.hypot(event.clientX - last.x, event.clientY - last.y);
        extra = Math.min(MAX_SPEED, extra + distance * PUSH);
      }
      last = { x: event.clientX, y: event.clientY };
    };
    const burst = () => {
      extra = Math.min(MAX_SPEED, extra + BURST);
      playIfEnabled("whoosh");
    };
    const tick = (_time: number, deltaMs: number) => {
      const seconds = Math.min(deltaMs, 100) / 1000;
      extra *= KEPT_PER_SECOND ** seconds;
      angle = (angle + (IDLE_SPEED + extra) * seconds) % 360;
      gsap.set(element, { rotation: angle });
    };

    window.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("click", burst);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      element.removeEventListener("click", burst);
      gsap.ticker.remove(tick);
      gsap.set(element, { clearProps: "rotation" });
    };
  }, []);

  return <Glyph ref={mark} aria-hidden="true" className={className} />;
}
