import { gsap } from "gsap";
import { LETTERS, MARKS_CENTER, type MarkId } from "./marks";

/** Marks arrive in this order, each from its own side. */
const ARRIVALS: ReadonlyArray<{ id: MarkId; axis: "x" | "y"; sign: 1 | -1 }> = [
  { id: "br", axis: "x", sign: 1 },
  { id: "bl", axis: "y", sign: 1 },
  { id: "tl", axis: "x", sign: -1 },
  { id: "tr", axis: "y", sign: -1 },
];
/** Fast then slow: almost the whole distance is covered in the first moments. */
const ENTER_EASE = "expo.out";
const ENTER_SECONDS = 1;
const ENTER_STAGGER = 0.14;
const SPIN_SECONDS = 0.8;
const SHRINK_SCALE = 0.55;
const SHRINK_SECONDS = 0.4;
const REGROW_SECONDS = 0.9;
const REGROW_EASE = "elastic.out(1, 0.45)";
const SLIDE_SECONDS = 0.45;
const PUSH_SECONDS = 1;
const TUMBLE_DEGREES = 18;
const OPEN_SECONDS = 1;
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
    .to("[data-panel='top']", { yPercent: -100, duration: OPEN_SECONDS, ease: "expo.inOut" }, 0)
    .to("[data-panel='bottom']", { yPercent: 100, duration: OPEN_SECONDS, ease: "expo.inOut" }, 0)
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

    ARRIVALS.forEach(({ id, axis, sign }, index) => {
      const at = index * ENTER_STAGGER;
      gsap.set(mark(id), { [axis]: sign * offscreen });
      enter
        .set(mark(id), { visibility: "visible" }, at)
        .to(mark(id), { [axis]: 0, duration: ENTER_SECONDS, ease: ENTER_EASE }, at);
    });

    const spinAt = ARRIVALS.length * ENTER_STAGGER + ENTER_SECONDS * 0.3;
    const regrowAt = spinAt + SHRINK_SECONDS;
    const slideAt = regrowAt + 0.15;
    const impactAt = slideAt + SLIDE_SECONDS;
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
