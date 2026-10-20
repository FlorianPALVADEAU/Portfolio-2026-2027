"use client";

import { gsap } from "gsap";
import { Fragment, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Seconds a phrase stays still before the next one turns in. */
const HOLD = 2.6;
/** Seconds before the first turn, so the opening line is read as it is first. */
const FIRST_HOLD = 3;
const LEAVE = 0.55;
const ENTER = 1;
/** Delay between two neighbouring letters, which makes the turn travel along the line as a wave. */
const WAVE = 0.028;
/** Perspective, in pixels, and how far behind the letters the drum's axis sits, in ems. */
const PERSPECTIVE = 700;
const AXIS_DEPTH = 0.4;

type RotatingTextProps = {
  /** The part that never changes, on its own line. */
  base: string;
  /** The endings that take turns under the base; the first one is the one shown at rest. */
  phrases: readonly string[];
  className?: string;
};

/**
 * A fixed line followed by an ending that is swapped for the next one every few seconds: the old
 * letters fold away over the top of a turning drum, in a wave along the line, while the new ones
 * come up from underneath. Screen readers get the base and
 * the first ending once; the rolling copy is hidden from them. Without script, or under reduced
 * motion, the first ending is shown and nothing moves.
 */
export function RotatingText({ base, phrases, className }: RotatingTextProps) {
  const frame = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element || phrases.length < 2 || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-rotating-phrase]");
      const depth = Number.parseFloat(getComputedStyle(element).fontSize) * AXIS_DEPTH;
      // Letters sit on the surface of a drum that turns upwards: the ones leaving fold away over
      // the top while the next ones come up from underneath, each blurring in and out of focus.
      const away = { rotationX: -95, yPercent: -35, opacity: 0, filter: "blur(10px)" };
      const below = { rotationX: 95, yPercent: 35, opacity: 0, filter: "blur(10px)" };
      const resting = { rotationX: 0, yPercent: 0, opacity: 1, filter: "blur(0px)" };
      const lettersOf = (item: HTMLElement) =>
        gsap.utils.toArray<HTMLElement>("[data-rotating-letter]", item);

      gsap.set("[data-rotating-letter]", {
        transformPerspective: PERSPECTIVE,
        transformOrigin: `50% 50% -${depth}px`,
      });
      gsap.set(items.slice(1), { autoAlpha: 0 });
      for (const item of items.slice(1)) gsap.set(lettersOf(item), below);

      let current = 0;
      function turn() {
        const leaving = items[current];
        current = (current + 1) % items.length;
        const entering = items[current];
        if (!(leaving && entering)) return;
        const timeline = gsap.timeline({ onComplete: () => gsap.delayedCall(HOLD, turn) });
        timeline.to(lettersOf(leaving), {
          ...away,
          duration: LEAVE,
          ease: "power3.in",
          stagger: WAVE,
        });
        timeline.set(leaving, { autoAlpha: 0 });
        timeline.set(entering, { autoAlpha: 1 });
        timeline.fromTo(
          lettersOf(entering),
          below,
          {
            ...resting,
            duration: ENTER,
            ease: "expo.out",
            stagger: WAVE,
          },
          `<+=${LEAVE * 0.1}`,
        );
        timeline.set(lettersOf(leaving), below);
      }

      gsap.delayedCall(FIRST_HOLD, turn);
    }, element);

    return () => context.revert();
  }, [phrases]);

  return (
    <div className={className}>
      <span className="sr-only">{`${base} ${phrases[0] ?? ""}`}</span>
      <div aria-hidden="true" className="flex flex-col items-center">
        <span>{base}</span>
        <div ref={frame} className="grid">
          {phrases.map((phrase) => (
            <span
              key={phrase}
              data-rotating-phrase
              className={cn("col-start-1 row-start-1", phrase !== phrases[0] && "invisible")}
            >
              {phrase.split(" ").map((word, index) => (
                // The words never reorder, so their position is a stable key.
                // biome-ignore lint/suspicious/noArrayIndexKey: see above
                <Fragment key={index}>
                  <span className="inline-block whitespace-nowrap">
                    {[...word].map((letter, position) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: letters never reorder
                        key={position}
                        data-rotating-letter
                        className="inline-block will-change-transform"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>{" "}
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
