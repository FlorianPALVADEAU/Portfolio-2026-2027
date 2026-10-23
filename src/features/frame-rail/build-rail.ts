import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clearScrollHint, markScrollHint, SMALL_SCREEN_QUERY, scrollToTop } from "@/lib/motion";
import { addFinale, FINALE_RATIO } from "./finale";
import { pick } from "./pick";

gsap.registerPlugin(ScrollTrigger);

/** Pixels of scrolling for each pixel the track travels; under 1 so a frame never drags on. */
const PACE = 0.8;
/** A small screen asks for more scrolling per frame, so a light swipe does not fly past one. */
const SMALL_SCREEN_PACE = 1.6;
const MAX_SKEW_DEG = 2;
/** Scroll velocity, in pixels per second, that adds one degree of skew. */
const VELOCITY_PER_DEG = 900;
const COUNT_SECONDS = 1.6;
/** Share of the screen height scrolled while the first and last frames stay still. */
const HOLD_RATIO = 0.6;

export type Rail = {
  /** Undoes everything `buildRail` did. */
  destroy: () => void;
  /** Scrolls the page to where a frame, counted from 0, sits centred. */
  goTo: (order: number) => void;
};

export type RailParts = {
  runway: HTMLElement;
  stage: HTMLElement;
  track: HTMLElement;
};

/** Figures read their final value without JavaScript; once pinned they count up when revealed. */
function setCounters(frame: HTMLElement, value: (target: number) => string) {
  for (const counter of pick<HTMLElement>(frame, "[data-count-to]")) {
    counter.textContent = value(Number(counter.dataset.countTo));
  }
}

function countUp(frame: HTMLElement) {
  for (const counter of pick<HTMLElement>(frame, "[data-count-to]")) {
    const state = { value: 0 };
    gsap.to(state, {
      value: Number(counter.dataset.countTo),
      duration: COUNT_SECONDS,
      ease: "power2.out",
      onUpdate: () => {
        counter.textContent = String(Math.round(state.value));
      },
    });
  }
}

/**
 * A layer drifts while its own frame crosses the screen: from +reach as the frame enters, to
 * -reach as it leaves, and rests where it was laid out when the frame is centred. A negative
 * reach drifts the other way, so layers at different depths slide against each other.
 */
function addParallax(
  timeline: gsap.core.Timeline,
  frames: HTMLElement[],
  viewport: number,
  hold: number,
) {
  frames.forEach((frame, order) => {
    const enters = order > 0;
    const leaves = order < frames.length - 1;
    const from = enters ? (order - 1) * viewport : 0;
    const to = leaves ? (order + 1) * viewport : order * viewport;
    for (const layer of pick<HTMLElement>(frame, "[data-frame-parallax]")) {
      const reach = Number(layer.dataset.frameParallax) * viewport;
      timeline.fromTo(
        layer,
        { x: enters ? reach : 0 },
        { x: leaves ? -reach : 0, duration: to - from },
        hold + from,
      );
    }
  });
}

/** A frame fills its segment of the bar from the moment it is half way in until it is half way out. */
function addProgressFills(
  timeline: gsap.core.Timeline,
  stage: HTMLElement,
  viewport: number,
  travel: number,
  hold: number,
) {
  pick<HTMLElement>(stage, "[data-frame-fill]").forEach((fill, order) => {
    const from = Math.max(0, (order - 0.5) * viewport);
    const to = Math.min(travel, (order + 0.5) * viewport);
    timeline.fromTo(
      fill,
      { scaleX: 0 },
      { scaleX: 1, duration: Math.max(1, to - from) },
      hold + from,
    );
  });
}

/**
 * Turns the stage into a pinned horizontal rail and returns a function that undoes it. The runway
 * is as tall as the scrolling asked for, the stage sticks to the top of it, and one scrubbed
 * timeline holds still for a moment, slides the track from frame to frame, then holds again.
 * The content of a frame is revealed the first time the frame reaches the middle of the screen.
 */
export function buildRail({ runway, stage, track }: RailParts): Rail {
  stage.dataset.motion = "rail";
  const frames = pick<HTMLElement>(track, "[data-frame]");
  const viewport = stage.clientWidth;
  const travel = track.scrollWidth - viewport;

  const undo = () => {
    runway.style.removeProperty("height");
    stage.dataset.motion = "static";
  };
  if (travel <= 0 || frames.length < 2) {
    undo();
    return { destroy: () => {}, goTo: () => {} };
  }
  const hold = stage.clientHeight * HOLD_RATIO;
  const finale = stage.querySelector("[data-frame-finale]") ? stage.clientHeight * FINALE_RATIO : 0;
  const total = travel + finale + hold * 2;
  const small = window.matchMedia(SMALL_SCREEN_QUERY).matches;
  const pace = small ? SMALL_SCREEN_PACE : PACE;
  runway.style.height = `${total * pace + stage.clientHeight}px`;

  // A frame taller than the screen scrolls inside itself, so the keyboard has to be able to reach it.
  const scrollable = frames.filter((frame) => frame.scrollHeight > frame.clientHeight);
  for (const frame of scrollable) frame.tabIndex = 0;

  for (const frame of frames) {
    frame.dataset.reveal = "off";
    setCounters(frame, () => "0");
  }

  // Progress of the timeline at each resting place: either end, every frame, the finished finale.
  const snapPoints = [
    0,
    ...frames.map((_, order) => (hold + order * viewport) / total),
    ...(finale > 0 ? [(hold + travel + finale) / total] : []),
    1,
  ];

  // A snap moves at most one stop from where the page last rested, however hard the swipe.
  let resting = 0;
  const nearest = (progress: number) =>
    snapPoints.reduce(
      (best, point, index) =>
        Math.abs(point - progress) < Math.abs((snapPoints[best] ?? 0) - progress) ? index : best,
      0,
    );
  const snapNearby = (progress: number) =>
    snapPoints[gsap.utils.clamp(resting - 1, resting + 1, nearest(progress))] ?? progress;

  markScrollHint(runway, (hold + travel + finale) * pace, "5.5rem");

  const context = gsap.context(() => {
    const reveal = (frame: HTMLElement | undefined) => {
      if (!frame || frame.dataset.reveal === "on") return;
      frame.dataset.reveal = "on";
      countUp(frame);
    };
    // The first frame waits until the section scrolls into view, so its entrance is seen.
    ScrollTrigger.create({
      trigger: runway,
      start: "top 75%",
      once: true,
      onEnter: () => reveal(frames[0]),
    });

    const skew = { value: 0 };
    const clampSkew = gsap.utils.clamp(-MAX_SKEW_DEG, MAX_SKEW_DEG);
    const applySkew = () => gsap.set(track, { skewX: skew.value });
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        ...(small && {
          onSnapComplete: (self: ScrollTrigger) => {
            resting = nearest(self.progress);
          },
          snap: {
            snapTo: snapNearby,
            inertia: false,
            duration: { min: 0.25, max: 0.7 },
            delay: 0.05,
            ease: "power2.inOut",
          },
        }),
        onUpdate: (self) => {
          const position = gsap.utils.clamp(0, travel, self.progress * total - hold);
          reveal(frames[Math.round(position / viewport)]);
          // The track is still before it starts and after it ends; skewing it then only shakes the page.
          if (position <= 0 || position >= travel) return;
          const target = clampSkew(-self.getVelocity() / VELOCITY_PER_DEG);
          if (Math.abs(target) <= Math.abs(skew.value)) return;
          skew.value = target;
          applySkew();
          gsap.to(skew, {
            value: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
            onUpdate: applySkew,
          });
        },
      },
    });

    // Every position and duration below is in pixels of travel, after a pause of `hold`.
    timeline.to(track, { x: -travel, duration: travel }, hold);

    addParallax(timeline, frames, viewport, hold);
    addProgressFills(timeline, stage, viewport, travel, hold);
    addFinale(timeline, stage, hold + travel, finale);
    // Once the closing photo slides in the steps are out of the way for good.
    const hud = stage.querySelector<HTMLElement>("[data-rail-hud]");
    if (hud && finale > 0) {
      timeline.to(hud, { autoAlpha: 0, duration: viewport * 0.4 }, hold + travel - viewport * 0.4);
    }

    // Without this the timeline ends with its last tween, and the scroll distance would shrink.
    timeline.set({}, {}, total);
  }, stage);

  const goTo = (order: number) => {
    const start = runway.getBoundingClientRect().top + window.scrollY;
    const position = gsap.utils.clamp(0, travel, order * viewport);
    resting = Math.max(0, snapPoints.indexOf((hold + position) / total));
    scrollToTop(start + (hold + position) * pace);
  };

  const destroy = () => {
    clearScrollHint(runway);
    context.revert();
    for (const frame of scrollable) frame.removeAttribute("tabindex");
    for (const frame of frames) {
      delete frame.dataset.reveal;
      setCounters(frame, String);
    }
    gsap.set(track, { clearProps: "transform" });
    undo();
  };
  return { destroy, goTo };
}
