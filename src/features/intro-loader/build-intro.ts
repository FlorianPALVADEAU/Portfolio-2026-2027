import { gsap } from "gsap";
import { MARK_SIZE, type MarkId } from "./marks";

const CENTER = MARK_SIZE / 2;
/** Marks arrive in this order, each from its own side. */
const ARRIVALS: ReadonlyArray<{ id: MarkId; axis: "x" | "y"; sign: 1 | -1 }> = [
  { id: "br", axis: "x", sign: 1 },
  { id: "bl", axis: "y", sign: 1 },
  { id: "tl", axis: "x", sign: -1 },
  { id: "tr", axis: "y", sign: -1 },
];
const ENTER_SECONDS = 0.65;
const ENTER_STAGGER = 0.12;
const SPIN_SECONDS = 0.7;
/** Large enough for the gap between the marks to outgrow any viewport. */
const OPEN_SCALE = 300;
const OPEN_SECONDS = 0.95;
/** The page entrance starts here, once the opening hole is wide enough to show it. */
const PAGE_CUE_SECONDS = 0.6;

type IntroOptions = {
  root: SVGSVGElement;
  /** Distance, in mark units, that puts a mark fully outside the viewport. */
  offscreen: number;
  /** Resolves when the page is ready to be shown. */
  ready: Promise<void>;
  onPageCue: () => void;
  onDone: () => void;
};

const layer = (name: "fill" | "hole", id?: MarkId) =>
  id ? `[data-layer="${name}"][data-mark="${id}"]` : `[data-layer="${name}"]`;

/** Marks fly in, the logo spins and breathes, then the page opens through the marks. Returns a cleanup. */
export function buildIntro({ root, offscreen, ready, onPageCue, onDone }: IntroOptions) {
  const fills = layer("fill");
  const holes = layer("hole");
  let cancelled = false;

  const open = gsap.timeline({ paused: true, onComplete: onDone });
  open
    .set(fills, { visibility: "hidden" })
    .set(holes, { visibility: "visible" })
    .to("[data-spin]", { scale: OPEN_SCALE, duration: OPEN_SECONDS, ease: "expo.in" }, 0)
    .call(onPageCue, undefined, PAGE_CUE_SECONDS);

  const enter = gsap.timeline({
    onComplete: () => {
      void ready.then(() => {
        if (!cancelled) open.play();
      });
    },
  });
  const context = gsap.context(() => {
    gsap.set("[data-spin]", { svgOrigin: `${CENTER} ${CENTER}` });
    ARRIVALS.forEach(({ id, axis, sign }, index) => {
      const target = layer("fill", id);
      const at = index * ENTER_STAGGER;
      gsap.set(target, { [axis]: sign * offscreen });
      enter
        .set(target, { visibility: "visible" }, at)
        .to(target, { [axis]: 0, duration: ENTER_SECONDS, ease: "power4.out" }, at);
    });
    const spinAt = ARRIVALS.length * ENTER_STAGGER + ENTER_SECONDS * 0.3;
    enter
      .to("[data-spin]", { rotation: 360, duration: SPIN_SECONDS, ease: "power3.inOut" }, spinAt)
      .to("[data-spin]", { scale: 1.18, duration: SPIN_SECONDS / 2, ease: "power2.out" }, spinAt)
      .to(
        "[data-spin]",
        { scale: 0.88, duration: SPIN_SECONDS / 2, ease: "power2.in" },
        spinAt + SPIN_SECONDS / 2,
      );
  }, root);

  return () => {
    cancelled = true;
    enter.kill();
    open.kill();
    context.revert();
  };
}
