import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hasFinePointer } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Pixels of scrolling for each pixel the track travels; under 1 so the rail never drags on. */
const PACE = 0.6;
/** Turn, in degrees, of a card that sits at the edge of the screen. */
const MAX_ANGLE_DEG = 52;
/** How far back, in pixels, a card at the edge of the screen sits. */
const DEPTH_PX = 380;
/** Share of its size that a card at the edge of the screen loses. */
const SHRINK = 0.12;
const MAX_SKEW_DEG = 4;
/** Scroll velocity, in pixels per second, that adds one degree of skew. */
const VELOCITY_PER_DEG = 700;
/** How dark the scrim over a card at the edge of the screen is, at most. */
const MAX_SCRIM = 0.75;

export type RailParts = {
  runway: HTMLElement;
  stage: HTMLElement;
  track: HTMLElement;
};

function pick<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** A card, with the centre of its box on the track and a setter for each property it moves. */
function describeCard(element: HTMLElement, trackLeft: number) {
  const scrim = element.querySelector("[data-rail-scrim]");
  return {
    element,
    center: element.getBoundingClientRect().left - trackLeft + element.offsetWidth / 2,
    turn: gsap.quickSetter(element, "rotationY", "deg"),
    depth: gsap.quickSetter(element, "z", "px"),
    scale: gsap.quickSetter(element, "scale"),
    skew: gsap.quickSetter(element, "skewX", "deg"),
    dim: scrim ? gsap.quickSetter(scrim, "opacity") : () => {},
  };
}

/**
 * Turns the stage into a pinned horizontal rail and returns a function that undoes it. The runway
 * is as tall as the scrolling asked for, the stage sticks to the top of it, and one scrubbed
 * timeline slides the track while every card is bent around the viewer by its distance from the
 * middle of the screen, like the inside of a cylinder.
 */
export function buildRail({ runway, stage, track }: RailParts): () => void {
  stage.dataset.motion = "rail";
  const viewport = window.innerWidth;
  const height = stage.clientHeight;
  const travel = track.scrollWidth - viewport;
  const trackLeft = track.getBoundingClientRect().left;
  const cards = pick<HTMLElement>(track, "[data-rail-card]").map((card) =>
    describeCard(card, trackLeft),
  );

  const undo = () => {
    runway.style.removeProperty("height");
    stage.dataset.motion = "static";
  };
  if (travel <= 0 || cards.length === 0) {
    undo();
    return () => {};
  }
  runway.style.height = `${travel * PACE + height}px`;

  const cleanups: (() => void)[] = [];
  const context = gsap.context(() => {
    let active = -1;
    const half = viewport / 2;
    const arrange = () => {
      const offset = Number(gsap.getProperty(track, "x"));
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, order) => {
        const distance = (card.center + offset - half) / half;
        const away = Math.min(Math.abs(distance), 1.5);
        card.turn(Math.sign(distance) * away * MAX_ANGLE_DEG);
        card.depth(-away * DEPTH_PX);
        card.scale(1 - away * SHRINK);
        card.dim(Math.min(MAX_SCRIM, away * MAX_SCRIM));
        if (away < nearestDistance) {
          nearest = order;
          nearestDistance = away;
        }
      });
      if (nearest === active) return;
      cards[active]?.element.removeAttribute("data-active");
      cards[nearest]?.element.setAttribute("data-active", "");
      active = nearest;
    };

    const skew = { value: 0 };
    const clampSkew = gsap.utils.clamp(-MAX_SKEW_DEG, MAX_SKEW_DEG);
    const applySkew = () => {
      for (const card of cards) card.skew(skew.value);
    };
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
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

    // Every position and duration below is in pixels of travel.
    timeline.to(track, { x: -travel, duration: travel, onUpdate: arrange }, 0);
    timeline.to("[data-rail-hint]", { autoAlpha: 0, duration: Math.min(260, travel) }, 0);
    timeline.to(
      "[data-rail-hud]",
      { autoAlpha: 0, duration: Math.min(viewport * 0.4, travel) },
      Math.max(0, travel - viewport * 0.7),
    );

    for (const layer of pick<HTMLElement>(track, "[data-rail-parallax]")) {
      const reach = Number(layer.dataset.railParallax) * viewport;
      timeline.fromTo(layer, { x: reach }, { x: -reach, duration: travel }, 0);
    }

    // A chapter fills its segment of the bar while it crosses the middle of the screen.
    const fills = pick<HTMLElement>(stage, "[data-rail-chapter-fill]");
    pick<HTMLElement>(track, "[data-rail-chapter]").forEach((chapter, order) => {
      const fill = fills[order];
      if (!fill) return;
      const left = chapter.getBoundingClientRect().left - trackLeft;
      const from = Math.max(0, left - half);
      const to = Math.min(travel, left + chapter.offsetWidth - half);
      timeline.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: Math.max(1, to - from) }, from);
    });
    arrange();

    // A soft light follows the pointer across the stage.
    if (hasFinePointer()) {
      gsap.set(stage, { "--mx": `${half}px`, "--my": `${height / 2}px` });
      const moveX = gsap.quickTo(stage, "--mx", { duration: 0.7, ease: "power3.out" });
      const moveY = gsap.quickTo(stage, "--my", { duration: 0.7, ease: "power3.out" });
      const follow = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);
      };
      stage.addEventListener("pointermove", follow, { passive: true });
      cleanups.push(() => stage.removeEventListener("pointermove", follow));
    }
    // Without this the timeline ends with its last tween, and the scroll distance would shrink.
    timeline.set({}, {}, travel);
  }, stage);

  return () => {
    for (const cleanup of cleanups) cleanup();
    context.revert();
    for (const { element } of cards) element.removeAttribute("data-active");
    undo();
  };
}
