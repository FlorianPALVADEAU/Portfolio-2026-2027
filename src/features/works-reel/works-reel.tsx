"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";
import { followTarget, skewTarget } from "./reel-physics";
import { prepareTypewriter, ROLLER_COPIES, splitIntoLetters } from "./reel-text";

gsap.registerPlugin(ScrollTrigger);

/** Degrees a card leans on its inner edge before it straightens. */
const TILT = 7;
/** Strongest shear of a cover, in degrees, on a wide screen and on a narrow one. */
const MAX_SKEW = 6;
const MAX_SKEW_SMALL = 3.5;

/** +1 for a card left of the grid's middle, -1 for one right of it, 0 when centred. */
function sideOf(item: HTMLElement, container: HTMLElement): number {
  const grid = container.getBoundingClientRect();
  const box = item.getBoundingClientRect();
  const offset = grid.left + grid.width / 2 - (box.left + box.width / 2);
  return Math.abs(offset) < grid.width * 0.05 ? 0 : Math.sign(offset);
}

/**
 * A row appears as a pair: both images lean with their inner edges down, then straighten and
 * grow slightly while the cover un-zooms. Tied to scroll, so it plays in both directions.
 */
function appearOnScroll(item: HTMLElement, cell: HTMLElement, container: HTMLElement) {
  const image = item.querySelector<HTMLElement>("[data-reel-image]");
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: cell,
      start: "top 98%",
      end: "top 50%",
      scrub: 0.5,
      invalidateOnRefresh: true,
    },
  });
  timeline.fromTo(
    item,
    { rotation: () => sideOf(cell, container) * TILT, scale: 0.84 },
    { rotation: 0, scale: 1, ease: "power2.out", duration: 1 },
    0,
  );
  if (image)
    timeline.fromTo(image, { scale: 1.5 }, { scale: 1, ease: "power2.out", duration: 1 }, 0);
}

/** Hides the title and tags, then plays them once the card is far enough into the viewport. */
function revealTextOnEnter(item: HTMLElement, restores: Array<() => void>) {
  const titleElement = item.querySelector<HTMLElement>("[data-reel-title]");
  const tagsElement = item.querySelector<HTMLElement>("[data-reel-tags]");
  const roller = titleElement ? splitIntoLetters(titleElement) : null;
  const typing = tagsElement ? prepareTypewriter(tagsElement) : null;
  const length = tagsElement?.textContent?.length ?? 0;

  if (roller) {
    restores.push(roller.restore);
    gsap.set(roller.strips, { yPercent: -100 * ((ROLLER_COPIES - 1) / ROLLER_COPIES) });
    gsap.set(roller.letters, { autoAlpha: 0 });
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
      if (roller) {
        gsap.to(roller.letters, { autoAlpha: 1, duration: 0.15, stagger: 0.03 });
        // Fast at first, then easing out: the strip falls past its copies before landing.
        gsap.to(roller.strips, { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.03 });
      }
      if (typing) {
        const progress = { value: 0 };
        gsap.to(progress, {
          value: 1,
          delay: 0.1,
          duration: Math.max(0.25, length * 0.008),
          ease: "none",
          onUpdate: () => typing.type(progress.value),
        });
      }
    },
  });
}

/**
 * Shears every cover with the scroll: the skew follows the instantaneous speed and direction,
 * lags behind it and eases back to a straight rectangle once the page stops. Layout never moves,
 * only the frame is transformed, so the text beneath stays upright.
 */
function skewWithScroll(frames: HTMLElement[]): () => void {
  const setters = frames.map((frame) => gsap.quickSetter(frame, "skewX", "deg"));
  const desktop = window.matchMedia("(min-width: 1024px)");
  let skew = 0;
  let lastY = window.scrollY;

  const tick = (_time: number, deltaTime: number) => {
    const seconds = Math.min(deltaTime, 100) / 1000;
    const velocity = ((window.scrollY - lastY) / Math.max(deltaTime, 1)) * 1000;
    lastY = window.scrollY;
    const target = skewTarget(velocity, desktop.matches ? MAX_SKEW : MAX_SKEW_SMALL);
    if (skew === 0 && target === 0) return;
    skew = followTarget(skew, target, seconds);
    for (const set of setters) set(skew);
  };

  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

/**
 * Carries the visitor through the project list. Rows appear in pairs that straighten and grow,
 * covers shear with the scroll speed, titles roll in letter by letter and tags are typed.
 * Marked descendants: `data-reel-cell`, `data-reel-item`, `data-reel-frame`, `data-reel-image`, `data-reel-title`,
 * `data-reel-tags`. With reduced motion nothing is touched and the list stays a plain list.
 */
export function WorksReel({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container || prefersReducedMotion()) return;

    const restores: Array<() => void> = [];
    const cells = gsap.utils.toArray<HTMLElement>("[data-reel-cell]", container);
    const context = gsap.context(() => {
      for (const cell of cells) {
        const item = cell.querySelector<HTMLElement>("[data-reel-item]");
        if (!item) continue;
        appearOnScroll(item, cell, container);
        revealTextOnEnter(item, restores);
      }
    }, container);
    const frames = gsap.utils.toArray<HTMLElement>("[data-reel-frame]", container);
    const stopSkew = skewWithScroll(frames);

    return () => {
      stopSkew();
      context.revert();
      gsap.set(frames, { clearProps: "skewX" });
      for (const restore of restores) restore();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
