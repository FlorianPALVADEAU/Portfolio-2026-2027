"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ComponentPropsWithoutRef, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Opacity of a word that has not been reached yet. */
const DIM = 0.16;

type LitTextProps = Omit<ComponentPropsWithoutRef<"p">, "children"> & {
  text: string;
};

/**
 * A paragraph whose words light up one after another as the visitor scrolls through it. Words are
 * dimmed only once the script runs and the text stays plain for assistive technology, so it is
 * fully readable without JavaScript or with reduced motion.
 */
export function LitText({ text, ...props }: LitTextProps) {
  const root = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-lit-word]",
        { opacity: DIM },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
            end: "bottom 48%",
            scrub: 0.4,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <p ref={root} {...props}>
      {text.split(" ").map((word, index) => (
        // The words never reorder, so their position is a stable key.
        // biome-ignore lint/suspicious/noArrayIndexKey: see above
        <span key={index} data-lit-word>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
