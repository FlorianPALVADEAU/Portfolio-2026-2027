"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Opacity of a word that has not been reached yet. */
const DIM = 0.16;
/** Viewport heights of scrolling, with the stage held in place, that light the whole text. */
const TRAVEL = 1.5;
const TRACK = `${(TRAVEL + 1) * 100}svh`;

type LitTextProps = {
  text: string;
  /** Classes of the paragraph. */
  className?: string;
  /** Classes of the full-screen stage that holds the paragraph and the children. */
  stageClassName?: string;
  /** Shown under the paragraph and held in place with it. */
  children?: ReactNode;
};

/**
 * A full-screen stage that stays in place while the visitor scrolls, lighting its paragraph word
 * by word. Scrolling goes on only once the last word is lit. Words are dimmed only once the script
 * runs and the text stays plain for assistive technology, so it is fully readable without
 * JavaScript. Under reduced motion the stage is not held and every word is lit.
 */
export function LitText({ text, className, stageClassName, children }: LitTextProps) {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = track.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
      timeline.fromTo(
        "[data-lit-word]",
        { opacity: DIM },
        { opacity: 1, duration: 0.2, stagger: { amount: 0.7 } },
      );
      // A short hold on the finished text before the stage is released.
      timeline.set({}, {}, 1);
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
        className={cn(
          "sticky top-0 h-svh motion-reduce:static motion-reduce:h-auto",
          stageClassName,
        )}
      >
        <p className={className}>
          {text.split(" ").map((word, index) => (
            // The words never reorder, so their position is a stable key.
            // biome-ignore lint/suspicious/noArrayIndexKey: see above
            <span key={index} data-lit-word>
              {word}{" "}
            </span>
          ))}
        </p>
        {children}
      </div>
    </div>
  );
}
