"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";

type NumeralPlayProps = {
  /** The characters to draw, one by one. */
  code: string;
  className?: string;
};

/** Furthest a character drifts from its place, in `vw`, for the one in the middle. */
const DRIFT_VW = 1.6;
/** Degrees a character leans per step away from the middle, at the screen's edge. */
const FAN_DEGREES = 2.5;
const HOP_SECONDS = 0.9;
/** Radius, in `rem`, of the pool of light that follows the pointer across the characters. */
const LIGHT_REM = 14;

/**
 * The oversized numeral of a dead end, in pieces that answer the visitor: they drift and fan out
 * against the pointer, a pool of accent light follows it across the letters, and a press (or a
 * tap) makes the character hop, and the zero turn over. Everything is decoration, so it is hidden
 * from assistive technology; each character also carries the rise mask of the page's entrance.
 */
export function NumeralPlay({ code, className }: NumeralPlayProps) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const digits = gsap.utils.toArray<HTMLElement>("[data-digit]", element);
    const middle = (digits.length - 1) / 2;
    const finePointer = hasFinePointer();
    const cleanups: Array<() => void> = [];

    const drift = digits.map((digit) => ({
      x: gsap.quickTo(digit, "x", { duration: 0.8, ease: "power3.out" }),
      y: gsap.quickTo(digit, "y", { duration: 0.8, ease: "power3.out" }),
      rotation: gsap.quickTo(digit, "rotation", { duration: 0.8, ease: "power3.out" }),
    }));

    if (finePointer) {
      const follow = (event: PointerEvent) => {
        const nx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ny = (event.clientY / window.innerHeight - 0.5) * 2;
        const unit = window.innerWidth / 100;
        digits.forEach((digit, index) => {
          const depth = 1 - Math.abs(index - middle) * 0.35;
          drift[index]?.x(-nx * DRIFT_VW * unit * depth);
          drift[index]?.y(-ny * DRIFT_VW * unit * depth * 0.6);
          drift[index]?.rotation(nx * FAN_DEGREES * (index - middle));
          const box = digit.getBoundingClientRect();
          digit.style.setProperty("--mx", `${event.clientX - box.left}px`);
          digit.style.setProperty("--my", `${event.clientY - box.top}px`);
        });
      };
      window.addEventListener("pointermove", follow, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", follow));
    }

    digits.forEach((digit, index) => {
      const isRound = digit.dataset.digit === "0";
      const grow = () => gsap.to(digit, { scale: 1.05, duration: 0.4, ease: "power3.out" });
      const settle = () => gsap.to(digit, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      const hop = () => {
        playIfEnabled(isRound ? "whoosh" : "pop");
        gsap
          .timeline({ defaults: { overwrite: "auto" } })
          .to(digit, { yPercent: -14, duration: HOP_SECONDS * 0.3, ease: "power3.out" })
          .to(digit, { yPercent: 0, duration: HOP_SECONDS * 0.7, ease: "bounce.out" });
        if (isRound) {
          gsap.fromTo(
            digit,
            { rotationY: 0, transformPerspective: 900 },
            { rotationY: 360, duration: HOP_SECONDS, ease: "back.out(1.4)" },
          );
        } else {
          gsap.fromTo(
            digit,
            { skewX: index < middle ? -8 : 8 },
            { skewX: 0, duration: HOP_SECONDS, ease: "elastic.out(1, 0.4)" },
          );
        }
      };
      if (finePointer) {
        digit.addEventListener("pointerenter", grow);
        digit.addEventListener("pointerleave", settle);
      }
      digit.addEventListener("click", hop);
      cleanups.push(() => {
        digit.removeEventListener("pointerenter", grow);
        digit.removeEventListener("pointerleave", settle);
        digit.removeEventListener("click", hop);
      });
    });

    return () => {
      for (const cleanup of cleanups) cleanup();
      gsap.killTweensOf(digits);
      gsap.set(digits, { clearProps: "all" });
    };
  }, []);

  // The characters never reorder, so their position names them.
  const characters = Array.from(code, (character, position) => ({
    id: `${position}-${character}`,
    character,
  }));

  return (
    <p ref={root} aria-hidden="true" className={className}>
      {characters.map(({ id, character }) => (
        <span key={id} data-digit={character} className="inline-block cursor-pointer select-none">
          <span data-rise-mask="" className="-mb-[0.12em] inline-block pb-[0.12em] align-bottom">
            <span
              data-rise-word=""
              style={{ "--light": `${LIGHT_REM}rem` } as React.CSSProperties}
              className="inline-block bg-clip-text text-transparent [background-image:radial-gradient(circle_var(--light)_at_var(--mx,-100rem)_var(--my,-100rem),var(--accent),var(--foreground)_70%)]"
            >
              {character}
            </span>
          </span>
        </span>
      ))}
    </p>
  );
}
