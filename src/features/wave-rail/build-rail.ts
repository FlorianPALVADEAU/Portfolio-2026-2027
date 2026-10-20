import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createWave, randomWavePoints, wavePath } from "@/lib/wave";
import type { Reveal } from "./rail-variants";

gsap.registerPlugin(ScrollTrigger);

/** Seed of the background wave; any value gives a pleasant line, this one is simply kept. */
const WAVE_SEED = 11;
/** Share of the stage height that a crest or a trough rises from the middle line, at most. */
const AMPLITUDE_SHARE = 0.32;
/** Share of the stage height taken by the thickness of the wave. */
const BAND_SHARE = 0.18;
/** Distance between two turning points of the wave, in widths of one node. */
const SPACING: readonly [number, number] = [1.2, 3];
/** Horizontal distance between two samples of the drawn path. */
const SAMPLE_PX = 8;
/** Where the drawing edge and the entrance of the labels sit on the screen, as a share of its width. */
const EDGE_SHARE = 0.85;
/** Length over which the drawn wave fades out at its leading edge. */
export const FADE_PX = 240;
const MAX_SKEW_DEG = 7;
/** Scroll velocity, in pixels per second, that adds one degree of skew. */
const VELOCITY_PER_DEG = 420;

/** Where a label starts, before it moves to rest inside the mask that clips it. */
const REVEAL_FROM: Record<Reveal, gsap.TweenVars> = {
  rise: { yPercent: 115 },
  drop: { yPercent: -115 },
  slide: { xPercent: -105 },
};

export type RailParts = {
  runway: HTMLElement;
  stage: HTMLElement;
  track: HTMLElement;
};

function pick<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** Draws the wave, which is only a backdrop: a thick faint band and a fine line along its middle. */
function drawWave(stage: HTMLElement, total: number, height: number, pitch: number) {
  const svg = stage.querySelector("svg");
  if (!svg) return;
  svg.setAttribute("viewBox", `0 0 ${total} ${height}`);

  const points = randomWavePoints({
    seed: WAVE_SEED,
    width: total,
    amplitude: height * AMPLITUDE_SHARE,
    spacing: [SPACING[0] * pitch, SPACING[1] * pitch],
  });
  const path = wavePath(createWave(points), {
    from: 0,
    to: total,
    step: SAMPLE_PX,
    baseline: height / 2,
  });
  for (const line of pick(svg, "[data-rail-wave]")) line.setAttribute("d", path);
  pick(svg, "[data-rail-band]").forEach((band) => {
    band.setAttribute("stroke-width", String(height * BAND_SHARE));
  });
}

/**
 * Turns the stage into a pinned horizontal rail and returns a function that undoes it. The runway
 * is as tall as the distance to travel, the stage sticks to the top of it, and one scrubbed
 * timeline, in pixels of scrolling, moves the track, draws the wave and brings the labels in.
 */
export function buildRail({ runway, stage, track }: RailParts): () => void {
  stage.dataset.motion = "rail";
  const viewport = window.innerWidth;
  const height = stage.clientHeight;
  const total = track.scrollWidth;
  const travel = total - viewport;
  const nodes = pick<HTMLElement>(track, "[data-rail-node]");
  const pitch = nodes[0]?.offsetWidth ?? 0;

  const undo = () => {
    runway.style.removeProperty("height");
    stage.dataset.motion = "static";
  };
  if (travel <= 0 || pitch === 0) {
    undo();
    return () => {};
  }

  runway.style.height = `${travel + height}px`;
  drawWave(stage, total, height, pitch);
  const trackLeft = track.getBoundingClientRect().left;

  const context = gsap.context(() => {
    const skew = { value: 0 };
    const setSkew = gsap.quickSetter(track, "skewX", "deg");
    const clampSkew = gsap.utils.clamp(-MAX_SKEW_DEG, MAX_SKEW_DEG);
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: runway,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          const target = clampSkew(-self.getVelocity() / VELOCITY_PER_DEG);
          if (Math.abs(target) <= Math.abs(skew.value)) return;
          skew.value = target;
          setSkew(target);
          gsap.to(skew, {
            value: 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => setSkew(skew.value),
          });
        },
      },
    });

    // Every position and duration below is in pixels of scrolling.
    timeline.to(track, { x: -travel, duration: travel }, 0);
    timeline.fromTo("[data-rail-progress]", { scaleX: 0 }, { scaleX: 1, duration: travel }, 0);
    timeline.to("[data-rail-hint]", { autoAlpha: 0, duration: Math.min(260, travel) }, 0);
    const edge = { from: viewport * EDGE_SHARE, to: total - viewport * (1 - EDGE_SHARE) };
    timeline.fromTo(
      "[data-rail-reveal-solid]",
      { attr: { width: edge.from - FADE_PX } },
      { attr: { width: edge.to - FADE_PX }, duration: travel },
      0,
    );
    timeline.fromTo(
      "[data-rail-reveal-fade]",
      { attr: { x: edge.from - FADE_PX } },
      { attr: { x: edge.to - FADE_PX }, duration: travel },
      0,
    );

    for (const layer of pick<HTMLElement>(track, "[data-rail-parallax]")) {
      const reach = Number(layer.dataset.railParallax) * viewport;
      timeline.fromTo(layer, { x: reach }, { x: -reach, duration: travel }, 0);
    }

    // Each label comes in as it crosses the drawing edge, in the way its place in the rhythm asks.
    const entrance = Math.min(220, travel * 0.06);
    for (const node of nodes) {
      const reveal = (node.dataset.railReveal ?? "rise") as Reveal;
      const offset = Number(node.dataset.railOffset);
      const x = node.getBoundingClientRect().left - trackLeft;
      const arrival = Math.max(0, x - viewport * EDGE_SHARE);
      gsap.set(pick(node, "[data-rail-label]"), { y: offset * height, yPercent: -50 });
      timeline.fromTo(
        pick(node, "[data-rail-text]"),
        { xPercent: 0, yPercent: 0, ...REVEAL_FROM[reveal] },
        { xPercent: 0, yPercent: 0, duration: entrance, ease: "power3.out" },
        arrival,
      );
    }
    // Without this the timeline ends with its last tween, and the scroll distance would shrink.
    timeline.set({}, {}, travel);
  }, stage);

  return () => {
    context.revert();
    undo();
  };
}
