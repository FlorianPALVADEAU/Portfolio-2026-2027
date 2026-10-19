"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";
import { prepareTypewriter, splitIntoLetters } from "./reel-text";

gsap.registerPlugin(ScrollTrigger);

const PERSPECTIVE = 1100;

function scrollRoll(item: HTMLElement) {
  const image = item.querySelector<HTMLElement>("[data-reel-image]");
  const roll = gsap.timeline({
    scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.6 },
  });
  roll.fromTo(
    item,
    { rotateX: 30, scale: 0.8, y: 120, transformPerspective: PERSPECTIVE },
    { rotateX: 0, scale: 1, y: 0, ease: "none", duration: 0.35 },
    0,
  );
  if (image) roll.fromTo(image, { scale: 1.4 }, { scale: 1, ease: "none", duration: 0.5 }, 0);
  roll.to(item, { rotateX: -16, scale: 0.9, y: -60, ease: "none", duration: 0.3 }, 0.7);
}

/** Hides the title and tags, then reveals them once the card is far enough into the viewport. */
function revealOnEnter(item: HTMLElement, restores: Array<() => void>) {
  const titleElement = item.querySelector<HTMLElement>("[data-reel-title]");
  const tagsElement = item.querySelector<HTMLElement>("[data-reel-tags]");
  const drum = titleElement ? splitIntoLetters(titleElement) : null;
  const typing = tagsElement ? prepareTypewriter(tagsElement) : null;
  const length = tagsElement?.textContent?.length ?? 0;

  if (drum) {
    restores.push(drum.restore);
    gsap.set(drum.letters, { autoAlpha: 0 });
  }
  if (typing) {
    restores.push(typing.restore);
    typing.type(0);
  }

  ScrollTrigger.create({
    trigger: item,
    start: "top 80%",
    once: true,
    onEnter: () => {
      playIfEnabled("pop");
      if (drum) {
        gsap.fromTo(
          drum.letters,
          {
            rotateX: -540,
            autoAlpha: 0,
            transformPerspective: 500,
            transformOrigin: "50% 50% -14px",
          },
          { rotateX: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.04 },
        );
      }
      if (typing) {
        const progress = { value: 0 };
        gsap.to(progress, {
          value: 1,
          delay: 0.35,
          duration: Math.max(0.6, length * 0.025),
          ease: "none",
          onUpdate: () => typing.type(progress.value),
        });
      }
    },
  });
}

/**
 * Carries the visitor through the project list: each card tilts and grows into place as it
 * scrolls in and tips away as it leaves, the cover zooms out inside its frame, the title spins
 * in like a rotating drum and the tags are typed out with a soft pop. Marked descendants:
 * `data-reel-item`, `data-reel-image`, `data-reel-title`, `data-reel-tags`. With reduced motion
 * nothing is touched and the list stays a plain list.
 */
export function WorksReel({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container || prefersReducedMotion()) return;

    const restores: Array<() => void> = [];
    const context = gsap.context(() => {
      for (const item of gsap.utils.toArray<HTMLElement>("[data-reel-item]", container)) {
        scrollRoll(item);
        revealOnEnter(item, restores);
      }
    }, container);

    return () => {
      context.revert();
      for (const restore of restores) restore();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
