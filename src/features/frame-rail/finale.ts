import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { pick } from "./pick";

gsap.registerPlugin(ScrollTrigger);

/** Share of the screen height scrolled while a closing photo shrinks and its texts appear. */
export const FINALE_RATIO = 1.2;

/**
 * A frame may end the rail with a photo (`data-frame-finale`, holding a `data-frame-finale-image`)
 * that fills the screen, then shrinks into a rounded card while its `data-frame-finale-text`
 * lines appear one after the other.
 */
export function addFinale(
  timeline: gsap.core.Timeline,
  stage: HTMLElement,
  start: number,
  duration: number,
) {
  const photo = stage.querySelector<HTMLElement>("[data-frame-finale]");
  if (!photo) return;
  const shrink = duration * 0.6;
  timeline.fromTo(
    photo,
    { clipPath: "inset(0% 0% 0% 0% round 0px)" },
    { clipPath: "inset(9% 7% 9% 7% round 40px)", duration: shrink, ease: "power2.inOut" },
    start,
  );
  const image = photo.querySelector<HTMLElement>("[data-frame-finale-image]");
  if (image) {
    timeline.fromTo(
      image,
      { scale: 1.18 },
      { scale: 1, duration: shrink, ease: "power2.inOut" },
      start,
    );
  }
  const texts = pick<HTMLElement>(stage, "[data-frame-finale-text]");
  const lineDuration = (duration - shrink) / 2;
  texts.forEach((text, order) => {
    timeline.fromTo(
      text,
      { autoAlpha: 0, y: 48 },
      { autoAlpha: 1, y: 0, duration: lineDuration, ease: "power3.out" },
      start + shrink + (order * (duration - shrink - lineDuration)) / Math.max(1, texts.length - 1),
    );
  });
}

/**
 * The closing photo on its own, for a stacked layout: the frame that holds it is pinned for as
 * long as the finale lasts. Returns a function that undoes it.
 */
export function buildFinale(stage: HTMLElement): () => void {
  const frame = stage.querySelector<HTMLElement>("[data-frame-finale]")?.closest("[data-frame]");
  if (!(frame instanceof HTMLElement)) return () => {};
  stage.dataset.motion = "finale";
  const context = gsap.context(() => {
    const length = frame.clientHeight * FINALE_RATIO;
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: frame,
        start: "top top",
        end: `+=${length}`,
        pin: true,
        scrub: 0.6,
      },
    });
    addFinale(timeline, stage, 0, length);
  }, stage);
  return () => {
    context.revert();
    stage.dataset.motion = "static";
  };
}
