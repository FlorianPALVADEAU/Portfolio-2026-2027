"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";
import { prepareTypewriter, ROLLER_COPIES, splitIntoLetters } from "./reel-text";

gsap.registerPlugin(ScrollTrigger);

/** Degrees a card leans on its inner edge before it straightens. */
const TILT = 7;
/** Fastest scroll, in px/s, that counts as a full pinch. */
const FULL_PINCH_VELOCITY = 3000;
const MAX_SHIFT = 48;

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
 * Fast scrolling pinches the grid: cards near the middle of the screen are pushed toward the
 * middle of the grid, so its sides bend inward like a string pulled across the centre.
 */
function pinchWhileScrolling(cells: HTMLElement[], container: HTMLElement): () => void {
  let pinch = 0;
  let lastY = window.scrollY;
  let touched = false;

  const tick = (_time: number, deltaTime: number) => {
    const speed = (Math.abs(window.scrollY - lastY) / Math.max(deltaTime, 1)) * 1000;
    lastY = window.scrollY;
    pinch += (Math.min(speed / FULL_PINCH_VELOCITY, 1) - pinch) * 0.12;
    if (pinch < 0.002 && !touched) return;

    const viewport = window.innerHeight;
    touched = pinch >= 0.002;
    for (const cell of cells) {
      const box = cell.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - viewport / 2) / (viewport * 0.7);
      const centred = (1 - Math.min(distance, 1)) ** 2;
      const amount = pinch * centred;
      gsap.set(cell, {
        x: sideOf(cell, container) * MAX_SHIFT * amount,
        scaleX: 1 - 0.06 * amount,
      });
    }
  };

  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

/**
 * Carries the visitor through the project list. Rows appear in pairs that straighten and grow,
 * fast scrolling pinches the grid's centre, titles roll in letter by letter and tags are typed.
 * Marked descendants: `data-reel-cell`, `data-reel-item`, `data-reel-image`, `data-reel-title`,
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
    const stopPinch = pinchWhileScrolling(cells, container);

    return () => {
      stopPinch();
      context.revert();
      gsap.set(cells, { clearProps: "x,scaleX" });
      for (const restore of restores) restore();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
