import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { LETTERS, MARKS_CENTER, type MarkId } from "./marks";

/** Marks arrive in this order, each from its own side. */
const ARRIVALS: ReadonlyArray<{ id: MarkId; axis: "x" | "y"; sign: 1 | -1 }> = [
  { id: "br", axis: "x", sign: 1 },
  { id: "bl", axis: "y", sign: 1 },
  { id: "tl", axis: "x", sign: -1 },
  { id: "tr", axis: "y", sign: -1 },
];
gsap.registerPlugin(CustomEase);
/** cubic-bezier(0.08, 0.82, 0.17, 1): launched at full speed, then a long soft settle with no rebound. */
const ENTER_EASE = CustomEase.create("intro-crash", "M0,0 C0.08,0.82 0.17,1 1,1");
/** cubic-bezier(0.86, 0, 0.07, 1): the halves hold, then part fast and settle off screen. */
const OPEN_EASE = CustomEase.create("intro-open", "M0,0 C0.86,0 0.07,1 1,1");
const ENTER_SECONDS = 0.65;
/** Share of the duration at which the mark has covered nearly all of its distance. */
const FIRST_HIT = 0.2;
/** Wide enough that each mark lands on its own, one after the other. */
const ENTER_STAGGER = 0.2;
const SETTLE_SECONDS = 0.1;
const MARK_SHAKE_PX = 10;
const LETTERS_SHAKE_PX = 16;
const SHAKE_SECONDS = 0.28;
const SPIN_SECONDS = 0.6;
const SHRINK_SCALE = 0.55;
const SHRINK_SECONDS = 0.28;
const REGROW_SECONDS = 0.7;
const REGROW_EASE = "elastic.out(1, 0.45)";
const SLIDE_SECONDS = 0.35;
const PUSH_SECONDS = 0.8;
const TUMBLE_DEGREES = 18;
/** Same rise as the footer: the line slides up from behind its own edge. */
const WELCOME_DELAY = 0.15;
const WELCOME_SECONDS = 0.8;
const WELCOME_START_PERCENT = 110;
const OPEN_SECONDS = 0.85;
/** The page entrance starts once the halves have parted enough to show it. */
const PAGE_CUE_SECONDS = 0.3;

type IntroOptions = {
  root: HTMLElement;
  /** Distance, in logo units, that puts the logo fully outside the viewport. */
  offscreen: number;
  /** Horizontal gap, in logo units, between the marks alone and the marks beside the letters. */
  markShift: number;
  /** Letter travel, in logo units, from the screen edge to the first touch with the marks. */
  contactTravel: number;
  /** Resolves when the page is ready to be shown. */
  ready: Promise<void>;
  onPageCue: () => void;
  onDone: () => void;
};

const mark = (id: MarkId) => `[data-mark="${id}"]`;

/** Jolts the whole logo along `axis`, then lets it settle. */
function shake(timeline: gsap.core.Timeline, at: number, axis: "x" | "y", pixels: number) {
  timeline.to(
    "[data-logo]",
    {
      keyframes: { [axis]: [pixels, -pixels * 0.7, pixels * 0.4, 0], easeEach: "power2.out" },
      duration: SHAKE_SECONDS,
    },
    at,
  );
}

/**
 * Marks fly in, the logo spins, shrinks and springs back, the letters slide in and knock the marks
 * aside, then the two halves of the screen part to open the page. Returns a cleanup.
 */
export function buildIntro({
  root,
  offscreen,
  markShift,
  contactTravel,
  ready,
  onPageCue,
  onDone,
}: IntroOptions) {
  let cancelled = false;

  const open = gsap.timeline({ paused: true, onComplete: onDone });
  open
    .to("[data-panel='top']", { yPercent: -50, duration: OPEN_SECONDS, ease: OPEN_EASE }, 0)
    .to("[data-panel='bottom']", { yPercent: 50, duration: OPEN_SECONDS, ease: OPEN_EASE }, 0)
    .call(onPageCue, undefined, PAGE_CUE_SECONDS);

  const enter = gsap.timeline({
    onComplete: () => {
      void ready.then(() => {
        if (!cancelled) open.play();
      });
    },
  });

  const context = gsap.context(() => {
    const spin = "[data-spin]";
    const letters = LETTERS.map(({ id }) => `[data-letter="${id}"]`);
    gsap.set(spin, { svgOrigin: `${MARKS_CENTER.x} ${MARKS_CENTER.y}` });
    gsap.set("[data-marks]", { x: -markShift });
    gsap.set("[data-letters]", { x: -offscreen });
    gsap.set("[data-welcome]", { yPercent: WELCOME_START_PERCENT, visibility: "visible" });

    ARRIVALS.forEach(({ id, axis, sign }, index) => {
      const at = index * ENTER_STAGGER;
      gsap.set(mark(id), { [axis]: sign * offscreen });
      enter
        .set(mark(id), { visibility: "visible" }, at)
        .to(mark(id), { [axis]: 0, duration: ENTER_SECONDS, ease: ENTER_EASE }, at);
      shake(enter, at + ENTER_SECONDS * FIRST_HIT, axis, -sign * MARK_SHAKE_PX);
    });

    const lastLanding = (ARRIVALS.length - 1) * ENTER_STAGGER + ENTER_SECONDS * FIRST_HIT;
    const spinAt = lastLanding + SETTLE_SECONDS;
    const regrowAt = spinAt + SHRINK_SECONDS;
    const slideAt = regrowAt + 0.05;
    const impactAt = slideAt + SLIDE_SECONDS;
    shake(enter, impactAt, "x", LETTERS_SHAKE_PX);
    enter.to(
      "[data-welcome]",
      { yPercent: 0, duration: WELCOME_SECONDS, ease: "expo.out" },
      impactAt + WELCOME_DELAY,
    );
    enter
      .to(spin, { rotation: 360, duration: SPIN_SECONDS, ease: "power3.inOut" }, spinAt)
      .to(spin, { scale: SHRINK_SCALE, duration: SHRINK_SECONDS, ease: "power2.in" }, spinAt)
      .to(spin, { scale: 1, duration: REGROW_SECONDS, ease: REGROW_EASE }, regrowAt)
      .set(letters, { visibility: "visible" }, slideAt)
      .to(
        "[data-letters]",
        { x: -contactTravel, duration: SLIDE_SECONDS, ease: "power3.in" },
        slideAt,
      )
      .to("[data-letters]", { x: 0, duration: PUSH_SECONDS * 0.8, ease: "expo.out" }, impactAt)
      .to("[data-marks]", { x: 0, duration: PUSH_SECONDS, ease: "elastic.out(1, 0.5)" }, impactAt)
      .fromTo(
        spin,
        { rotation: 360 - TUMBLE_DEGREES },
        { rotation: 360, duration: PUSH_SECONDS, ease: "elastic.out(1, 0.4)" },
        impactAt,
      );
  }, root);

  return () => {
    cancelled = true;
    enter.kill();
    open.kill();
    context.revert();
  };
}
