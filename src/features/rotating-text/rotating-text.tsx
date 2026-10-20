"use client";

import { gsap } from "gsap";
import { Fragment, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Seconds a phrase stays still before the next one rolls in. */
const HOLD = 2.4;
/** Seconds before the first roll, so the opening line is read as it is first. */
const FIRST_HOLD = 3;
const ROLL = 0.7;
const STAGGER = 0.05;

type RotatingTextProps = {
  /** The part that never changes, on its own line. */
  base: string;
  /** The endings that take turns under the base; the first one is the one shown at rest. */
  phrases: readonly string[];
  className?: string;
};

/**
 * A fixed line followed by an ending that is swapped for the next one every few seconds: the old
 * words roll up and out while the new ones rise in behind them. Screen readers get the base and
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
      let current = 0;
      gsap.set(items.slice(1), { autoAlpha: 0 });

      function roll() {
        const leaving = items[current];
        current = (current + 1) % items.length;
        const entering = items[current];
        if (!(leaving && entering)) return;
        const distance = element?.clientHeight ?? 0;
        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut", duration: ROLL },
          onComplete: () => {
            gsap.delayedCall(HOLD, roll);
          },
        });
        timeline.to(leaving.querySelectorAll("[data-rotating-word]"), {
          y: -distance,
          stagger: STAGGER,
        });
        timeline.set(leaving, { autoAlpha: 0 });
        timeline.set(entering, { autoAlpha: 1 });
        timeline.fromTo(
          entering.querySelectorAll("[data-rotating-word]"),
          { y: distance },
          { y: 0, stagger: STAGGER },
          `<-${ROLL * 0.6}`,
        );
      }

      gsap.delayedCall(FIRST_HOLD, roll);
    }, element);

    return () => context.revert();
  }, [phrases]);

  return (
    <div className={className}>
      <span className="sr-only">{`${base} ${phrases[0] ?? ""}`}</span>
      <div aria-hidden="true" className="flex flex-col items-center">
        <span>{base}</span>
        <div ref={frame} className="-mb-[0.12em] grid overflow-clip pb-[0.12em]">
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
                  <span data-rotating-word className="inline-block">
                    {word}
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
