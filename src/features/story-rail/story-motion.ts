import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Panels grow from this share of their size while they slide in, picture un-zooming inside. */
const GROW_FROM = 0.84;
const ZOOM_FROM = 1.5;
/** How far, in share of its own width, a picture drifts inside its frame while it crosses. */
const DRIFT = 16;
/** A picture is drawn this much larger than its frame so the drift never shows an edge. */
const DRIFT_SCALE = 1.4;
/** The same drift down a stacked page, where a picture is wide and short and has little room. */
const STACKED_DRIFT = 6;
const STACKED_SCALE = 1.14;
/** Degrees of lean per pixel the row travels in a frame, and the most it ever leans. */
const SKEW_PER_PIXEL = 0.12;
const SKEW_LIMIT = 9;
/** Pixels things lag behind per pixel of speed, and the most they ever lag. */
const LAG_PER_PIXEL = 1.1;
const LAG_LIMIT = 48;
/** Share of the remaining gap the lean closes on each frame. */
const SETTLE = 0.14;
/** Words rise this far below their mask. */
const RISE_FROM = 110;

/** The way the story is read: along the row on large screens, down the page elsewhere. */
export type Axis = "x" | "y";

/** The scroller a trigger follows: the row itself sideways, the page when the story is stacked. */
const along = (row: HTMLElement, axis: Axis) =>
  axis === "x" ? ({ scroller: row, horizontal: true } as const) : {};

/** `start` of a trigger whose element is `share`% of the screen away from its leading edge. */
const entering = (axis: Axis, share: number) =>
  axis === "x" ? `left ${share}%` : `top ${share - 14}%`;

/**
 * Hides what will appear, at once, so that nothing shows and then vanishes while the intro screen
 * is still up: frames are closed and words sit below their masks until `revealOnEnter` runs.
 */
export function hideBeforeEntrance(row: HTMLElement) {
  gsap.set(gsap.utils.toArray("[data-story-frame]", row), {
    clipPath: "inset(0% 100% 0% 0%)",
    autoAlpha: 0,
  });
  gsap.set(gsap.utils.toArray("[data-rise-mask]", row), { overflow: "hidden" });
  gsap.set(gsap.utils.toArray("[data-rise-word]", row), { yPercent: RISE_FROM });
}

/**
 * Shows each thing as it comes into view, a little before it does: a frame is wiped open from the
 * left and settles in from slightly larger, and the words of a `data-story-rise` block slide up
 * from behind their masks, one after another, like the footer. Played once, and rewound if the
 * visitor goes back far enough.
 */
export function revealOnEnter(row: HTMLElement, axis: Axis) {
  for (const frame of gsap.utils.toArray<HTMLElement>("[data-story-frame]", row)) {
    const reveal = gsap.to(frame, {
      clipPath: "inset(0% 0% 0% 0%)",
      autoAlpha: 1,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
      paused: true,
    });
    gsap.set(frame, { scale: 1.06 });
    ScrollTrigger.create({
      ...along(row, axis),
      trigger: frame,
      start: entering(axis, 118),
      onEnter: () => reveal.play(),
      onLeaveBack: () => reveal.reverse(),
    });
  }

  for (const block of gsap.utils.toArray<HTMLElement>("[data-story-rise]", row)) {
    const words = gsap.utils.toArray<HTMLElement>("[data-rise-word]", block);
    if (words.length === 0) continue;
    const rise = gsap.to(words, {
      yPercent: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.045,
      paused: true,
      onComplete: () => {
        gsap.set(gsap.utils.toArray("[data-rise-mask]", block), { clearProps: "overflow" });
        gsap.set(words, { clearProps: "transform" });
      },
    });
    ScrollTrigger.create({
      ...along(row, axis),
      trigger: block,
      start: entering(axis, 112),
      onEnter: () => rise.play(),
    });
  }
}

/** The first panels past the intro slide in from the right once, so the page opens as a gesture. */
export function slideInNeighbours(row: HTMLElement) {
  const panels = gsap.utils
    .toArray<HTMLElement>("[data-story-panel]", row)
    .filter((panel) => panel.offsetLeft > 0 && panel.offsetLeft < window.innerWidth * 1.4);
  gsap.from(panels, {
    x: 180,
    autoAlpha: 0,
    duration: 1.3,
    ease: "expo.out",
    stagger: 0.12,
    delay: 0.35,
    clearProps: "all",
  });
}

/** The picture layer of a frame slides across it while the frame crosses the screen. */
function drift(row: HTMLElement, element: HTMLElement, axis: Axis) {
  const layer = element.querySelector<HTMLElement>("[data-story-parallax]");
  if (!layer) return;
  const sideways = axis === "x";
  const [from, to] = sideways
    ? [
        { xPercent: -DRIFT, scale: DRIFT_SCALE },
        { xPercent: DRIFT, scale: DRIFT_SCALE },
      ]
    : [
        { yPercent: -STACKED_DRIFT, scale: STACKED_SCALE },
        { yPercent: STACKED_DRIFT, scale: STACKED_SCALE },
      ];
  gsap.fromTo(layer, from, {
    ...to,
    ease: "none",
    scrollTrigger: {
      ...along(row, axis),
      trigger: element,
      start: sideways ? "left right" : "top bottom",
      end: sideways ? "right left" : "bottom top",
      scrub: true,
    },
  });
}

/** Pictures grow and un-zoom as they arrive, then drift against the scroll while they cross. */
export function growAndDrift(row: HTMLElement, axis: Axis) {
  for (const element of gsap.utils.toArray<HTMLElement>("[data-story-grow]", row)) {
    const arriving = {
      ...along(row, axis),
      trigger: element,
      start: entering(axis, 112),
      end: axis === "x" ? "left 50%" : "top 40%",
      scrub: 0.4,
    };
    gsap.fromTo(
      element,
      { scale: GROW_FROM },
      { scale: 1, ease: "power2.out", scrollTrigger: arriving },
    );

    const picture = element.querySelector<HTMLElement>("[data-story-zoom]");
    if (picture) {
      gsap.fromTo(
        picture,
        { scale: ZOOM_FROM },
        { scale: 1, ease: "power2.out", scrollTrigger: arriving },
      );
    }

    drift(row, element, axis);
  }
}

/**
 * Makes the speed of the scroll visible: things marked `data-story-velocity` lean and lag behind
 * the faster the row travels, and the picture layers are pushed against it on top of their drift.
 * Everything eases back to rest when the scroll stops.
 */
export function trackVelocity(row: HTMLElement): () => void {
  const leaning = gsap.utils.toArray<HTMLElement>("[data-story-velocity]", row);
  const pushed = gsap.utils.toArray<HTMLElement>("[data-story-parallax]", row);
  const clamp = gsap.utils.clamp;
  let last = row.scrollLeft;
  let skew = 0;
  let lag = 0;

  const tick = () => {
    const speed = row.scrollLeft - last;
    last = row.scrollLeft;
    skew += (clamp(-SKEW_LIMIT, SKEW_LIMIT, -speed * SKEW_PER_PIXEL) - skew) * SETTLE;
    lag += (clamp(-LAG_LIMIT, LAG_LIMIT, -speed * LAG_PER_PIXEL) - lag) * SETTLE;
    gsap.set(leaning, { skewX: skew, x: lag * 0.5 });
    gsap.set(pushed, { x: lag });
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    gsap.set([...leaning, ...pushed], { clearProps: "skewX,x" });
  };
}
