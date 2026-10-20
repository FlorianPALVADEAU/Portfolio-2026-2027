"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Opacity of a word that has not been reached yet; low enough that only the lit words read. */
const DIM = 0.12;
/** Share of the scroll that lights the words; the stage fades out over the rest. */
const LIGHT_SPAN = 0.8;
/** How many neighbouring words are mid-fade at once: higher is softer, lower is more word by word. */
const WORD_OVERLAP = 2.5;
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
 * JavaScript. The stage fades out as it ends, and its negative bottom margin pulls the next
 * section up by one viewport, so that section can take over at the moment the stage is released.
 * Under reduced motion the stage is not held, nothing overlaps and every word is lit.
 */
export function LitText({ text, className, stageClassName, children }: LitTextProps) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

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
      const words = gsap.utils.toArray<HTMLElement>("[data-lit-word]", element);
      // Each word fades over a few word-slots, so words light one after another with a soft edge.
      const slot = LIGHT_SPAN / (words.length - 1 + WORD_OVERLAP);
      timeline.fromTo(
        words,
        { opacity: DIM },
        { opacity: 1, duration: slot * WORD_OVERLAP, ease: "power1.out", stagger: slot },
        0,
      );
      timeline.to(stage.current, { opacity: 0, duration: 1 - LIGHT_SPAN }, LIGHT_SPAN);
    }, element);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={track}
      style={{ "--track": TRACK } as CSSProperties}
      className="-mb-[100svh] h-(--track) motion-reduce:mb-0 motion-reduce:h-auto"
    >
      <div
        ref={stage}
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
