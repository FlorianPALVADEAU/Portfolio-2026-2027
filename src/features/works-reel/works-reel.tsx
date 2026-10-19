"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { canRenderScene } from "@/lib/scene";
import { playIfEnabled } from "@/lib/sound";
import { type CoverState, type ReelCover, restingState } from "./reel-cover";
import { prepareTypewriter, ROLLER_COPIES, splitIntoLetters } from "./reel-text";

gsap.registerPlugin(ScrollTrigger);

const ReelCanvas = dynamic(() => import("./reel-canvas"), { ssr: false });

/** Degrees a cover leans on its inner edge before it straightens. */
const TILT = 7;

/** +1 for a card left of the grid's middle, -1 for one right of it, 0 when centred. */
function sideOf(item: HTMLElement, container: HTMLElement): number {
  const grid = container.getBoundingClientRect();
  const box = item.getBoundingClientRect();
  const offset = grid.left + grid.width / 2 - (box.left + box.width / 2);
  return Math.abs(offset) < grid.width * 0.05 ? 0 : Math.sign(offset);
}

/**
 * A row appears as a pair: both covers lean with their inner edges down, then straighten and
 * grow slightly while the picture un-zooms. Tied to scroll, so it plays in both directions.
 */
function appearOnScroll(state: CoverState, cell: HTMLElement, container: HTMLElement) {
  gsap.fromTo(
    state,
    { tilt: () => sideOf(cell, container) * TILT, grow: 0.84, zoom: 1.5 },
    {
      tilt: 0,
      grow: 1,
      zoom: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cell,
        start: "top 98%",
        end: "top 50%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    },
  );
}

/** Eases the hover zoom of a cover in and out, for the pointer and for keyboard focus alike. */
function followHover(item: HTMLElement, state: CoverState): () => void {
  const to = (hover: number) => () =>
    gsap.to(state, { hover, duration: 0.6, ease: "power3.out", overwrite: true });
  const enter = to(1);
  const leave = to(0);
  item.addEventListener("pointerenter", enter);
  item.addEventListener("pointerleave", leave);
  item.addEventListener("focusin", enter);
  item.addEventListener("focusout", leave);
  return () => {
    item.removeEventListener("pointerenter", enter);
    item.removeEventListener("pointerleave", leave);
    item.removeEventListener("focusin", enter);
    item.removeEventListener("focusout", leave);
  };
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
 * Carries the visitor through the project list. Covers are drawn as planes in one canvas and bend
 * like the inside of a tube while the page moves, rows appear in pairs that straighten and grow,
 * titles roll in letter by letter and tags decode from noise.
 * Marked descendants: `data-reel-cell`, `data-reel-item`, `data-reel-frame`, `data-reel-image`,
 * `data-reel-title`, `data-reel-tags`. Without WebGL or with reduced motion the DOM covers stay
 * and the list stays a plain list.
 */
export function WorksReel({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [covers, setCovers] = useState<ReelCover[]>([]);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container || prefersReducedMotion()) return;

    const restores: Array<() => void> = [];
    const planes: ReelCover[] = [];
    const cells = gsap.utils.toArray<HTMLElement>("[data-reel-cell]", container);
    const drawable = canRenderScene();
    const context = gsap.context(() => {
      cells.forEach((cell, index) => {
        const item = cell.querySelector<HTMLElement>("[data-reel-item]");
        if (!item) return;
        revealTextOnEnter(item, restores);
        const frame = item.querySelector<HTMLElement>("[data-reel-frame]");
        const image = item.querySelector<HTMLImageElement>("[data-reel-image]");
        if (!(drawable && frame && image)) return;

        const state = restingState();
        appearOnScroll(state, cell, container);
        restores.push(followHover(item, state));
        planes.push({ id: `cover-${index}`, frame, image, state });
      });
    }, container);
    setCovers(planes);

    return () => {
      setCovers([]);
      context.revert();
      for (const restore of restores) restore();
    };
  }, []);

  return (
    <div ref={root}>
      {children}
      {covers.length > 0 && root.current ? (
        <ReelCanvas covers={covers} container={root.current} />
      ) : null}
    </div>
  );
}
