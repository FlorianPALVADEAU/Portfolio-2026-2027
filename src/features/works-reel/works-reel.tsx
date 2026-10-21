"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { canRenderScene } from "@/lib/scene";
import { playIfEnabled, preloadFocusIfEnabled } from "@/lib/sound";
import { type CoverState, type ReelCover, restingState } from "./reel-cover";
import { prepareTypewriter, ROLLER_COPIES, splitIntoLetters } from "./reel-text";

gsap.registerPlugin(ScrollTrigger);

const ReelCanvas = dynamic(() => import("./reel-canvas"), { ssr: false });

/** The 3D code is a large download, so it starts once the list is this close to the screen. */
const CANVAS_LEAD = "100% 0px";

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

/**
 * A photographer racking focus with a hand-held camera: the picture starts a little out of focus,
 * the focal line sweeps across it and hunts back and forth while the hand trembles, the shutter
 * dips twice, and everything settles to a sharp, steady picture.
 * Each step is `[focus, blur, shake, seconds]`.
 */
const FOCUS_HUNT: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.95, 0.5, 0.4, 0],
  [0.08, 0.42, 1, 0.34],
  [0.72, 0.3, 0.7, 0.24],
  [0.3, 0.18, 0.9, 0.2],
  [0.58, 0.08, 0.45, 0.17],
  [0.46, 0.03, 0.25, 0.14],
  [0.5, 0, 0, 0.3],
];
/** The table above is timed at its natural pace; the pull plays this many times faster. */
const PULL_SPEED = 1.4;
/** Seconds into the pull at which the shutter dips. */
const SHUTTER_AT = [0.3, 0.78] as const;

function pullFocus(state: CoverState): gsap.core.Timeline {
  const pull = gsap.timeline();
  let at = 0;
  for (const [focus, blur, shake, seconds] of FOCUS_HUNT) {
    pull.to(state, { focus, blur, shake, duration: seconds, ease: "power2.inOut" }, at);
    at += seconds;
  }
  for (const time of SHUTTER_AT) {
    pull.to(state, { shutter: 1, duration: 0.04, ease: "none" }, time);
    pull.to(state, { shutter: 0, duration: 0.12, ease: "power2.out" }, time + 0.04);
  }
  return pull.timeScale(PULL_SPEED);
}

/**
 * Eases the hover zoom of a cover in and out, and pulls focus on entry, for the pointer and for
 * keyboard focus alike. `overwrite: "auto"` only replaces tweens of `hover`; `true` would also kill
 * the scroll tween sharing this state and freeze the cover mid-tilt.
 */
function followHover(item: HTMLElement, state: CoverState): () => void {
  let pull: gsap.core.Timeline | null = null;
  const to = (hover: number) => () =>
    gsap.to(state, { hover, duration: 0.6, ease: "power3.out", overwrite: "auto" });
  const zoomIn = to(1);
  const zoomOut = to(0);
  const enter = () => {
    zoomIn();
    playIfEnabled("focus");
    pull?.kill();
    pull = pullFocus(state);
  };
  const leave = () => {
    zoomOut();
    pull?.kill();
    pull = null;
    gsap.to(state, { blur: 0, shake: 0, shutter: 0, duration: 0.2, overwrite: "auto" });
  };
  item.addEventListener("pointerenter", enter);
  item.addEventListener("pointerleave", leave);
  item.addEventListener("focusin", enter);
  item.addEventListener("focusout", leave);
  return () => {
    pull?.kill();
    item.removeEventListener("pointerenter", enter);
    item.removeEventListener("pointerleave", leave);
    item.removeEventListener("focusin", enter);
    item.removeEventListener("focusout", leave);
  };
}

/** Px beyond the viewport edge a text must travel before it is reset, so a reset is never seen. */
const RESET_MARGIN = 120;

/**
 * Plays `play` when the element enters the viewport and `hide` only once it is fully out of
 * sight, on either side, so scrolling away and back replays it without ever flashing a reset.
 */
function playWhileVisible(element: HTMLElement, play: () => void, hide: () => void) {
  ScrollTrigger.create({
    trigger: element,
    start: "top 92%",
    end: `bottom top-=${RESET_MARGIN}`,
    onEnter: play,
    onEnterBack: play,
    onLeave: hide,
  });
  ScrollTrigger.create({
    trigger: element,
    start: `top bottom+=${RESET_MARGIN}`,
    onLeaveBack: hide,
  });
}

/**
 * Hides the title and tags and plays each one as it enters the viewport. Hovering the title
 * flips its letters once.
 */
function revealTextOnEnter(item: HTMLElement, restores: Array<() => void>) {
  const titleElement = item.querySelector<HTMLElement>("[data-reel-title]");
  const tagsElement = item.querySelector<HTMLElement>("[data-reel-tags]");
  const roller = titleElement ? splitIntoLetters(titleElement) : null;
  const typing = tagsElement ? prepareTypewriter(tagsElement) : null;
  const length = tagsElement?.textContent?.length ?? 0;
  const resting = -100 * ((ROLLER_COPIES - 1) / ROLLER_COPIES);
  let titleReveal: gsap.core.Timeline | null = null;
  let tagsReveal: gsap.core.Tween | null = null;
  let flip: gsap.core.Tween | null = null;

  if (roller) restores.push(roller.restore);
  if (typing) restores.push(typing.restore);

  const hideTitle = () => {
    titleReveal?.kill();
    flip?.kill();
    if (!roller) return;
    gsap.set(roller.strips, { yPercent: resting });
    gsap.set(roller.letters, { autoAlpha: 0 });
  };
  const hideTags = () => {
    tagsReveal?.kill();
    typing?.type(0);
  };

  const playTitle = () => {
    if (!roller) return;
    hideTitle();
    playIfEnabled("pop");
    titleReveal = gsap.timeline();
    titleReveal.to(roller.letters, { autoAlpha: 1, duration: 0.1, stagger: 0.02 }, 0);
    // Fast at first, then easing out: the strip falls twice past its copies before landing.
    titleReveal.to(
      roller.strips,
      { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.02 },
      0,
    );
  };
  const playTags = () => {
    if (!typing) return;
    hideTags();
    const progress = { value: 0 };
    tagsReveal = gsap.to(progress, {
      value: 1,
      duration: Math.max(0.2, length * 0.006),
      ease: "none",
      onUpdate: () => typing.type(progress.value),
    });
  };

  hideTitle();
  hideTags();
  if (titleElement) playWhileVisible(titleElement, playTitle, hideTitle);
  if (tagsElement) playWhileVisible(tagsElement, playTags, hideTags);

  if (roller && titleElement) {
    const onHover = () => {
      if (titleReveal?.isActive() || flip?.isActive()) return;
      gsap.set(roller.strips, { yPercent: resting });
      flip = gsap.to(roller.strips, {
        yPercent: 0,
        duration: 0.5,
        ease: "expo.out",
        stagger: 0.015,
      });
    };
    titleElement.addEventListener("pointerenter", onHover);
    restores.push(() => titleElement.removeEventListener("pointerenter", onHover));
  }
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
  const [near, setNear] = useState(false);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: CANVAS_LEAD },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container || prefersReducedMotion()) return;

    const restores: Array<() => void> = [];
    const planes: ReelCover[] = [];
    const cells = gsap.utils.toArray<HTMLElement>("[data-reel-cell]", container);
    const drawable = canRenderScene();
    if (drawable) preloadFocusIfEnabled();
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
      {near && covers.length > 0 && root.current ? (
        <ReelCanvas covers={covers} container={root.current} />
      ) : null}
    </div>
  );
}
