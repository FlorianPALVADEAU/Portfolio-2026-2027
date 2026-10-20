import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createWave, echoWave, type Wave, type WavePoint, wavePath } from "@/lib/wave";

gsap.registerPlugin(ScrollTrigger);

/** Share of the stage height that a crest or a trough rises from the middle line, at most. */
const AMPLITUDE_SHARE = 0.17;
const AMPLITUDE_MAX_PX = 230;
/** Where the drawing head starts on the screen, as a share of its width; it ends at the right edge. */
const HEAD_START_SHARE = 0.25;
/** Horizontal distance between two samples of a drawn path. */
const SAMPLE_PX = 8;
/** Distance between a dot and its label, which is also the length of the stem. */
const STEM_PX = 32;
const MAX_SKEW_DEG = 7;
/** Scroll velocity, in pixels per second, that adds one degree of skew. */
const VELOCITY_PER_DEG = 420;

export type RailParts = {
  runway: HTMLElement;
  stage: HTMLElement;
  track: HTMLElement;
};

function pick<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** Crests and troughs alternate, starting with a crest; the line starts and ends level. */
function nodePoints(xs: readonly number[], amplitude: number, pitch: number, total: number) {
  const first = xs[0] ?? 0;
  const last = xs.at(-1) ?? total;
  const points: WavePoint[] = [{ x: Math.max(0, first - pitch), y: 0 }];
  xs.forEach((x, index) => {
    points.push({ x, y: index % 2 === 0 ? -amplitude : amplitude });
  });
  points.push({ x: Math.min(total, last + pitch), y: 0 });
  return points;
}

type Drawing = { wave: Wave; pitch: number; total: number; end: number; height: number };

/** Draws every line from the left edge to `end`, where the wave stops for good. */
function drawWaves(stage: HTMLElement, { wave, pitch, total, end, height }: Drawing) {
  const svg = stage.querySelector("svg");
  if (!svg) return;
  svg.setAttribute("viewBox", `0 0 ${total} ${height}`);

  const echoes = [
    echoWave(wave, { scale: -0.5, shift: pitch * 0.6 }),
    echoWave(wave, { scale: 0.3, shift: -pitch * 0.9 }),
  ];
  const layers = [wave, wave, ...echoes];
  pick<SVGPathElement>(svg, "[data-rail-wave]").forEach((path, index) => {
    const layer = layers[index];
    if (layer) {
      path.setAttribute(
        "d",
        wavePath(layer, { from: 0, to: end, step: SAMPLE_PX, baseline: height / 2 }),
      );
    }
  });
}

/**
 * Turns the stage into a pinned horizontal rail and returns a function that undoes it. The runway
 * is as tall as the distance to travel, the stage sticks to the top of it, and one scrubbed
 * timeline, in pixels of scrolling, moves the track, draws the waves and lights up the nodes.
 */
export function buildRail({ runway, stage, track }: RailParts): () => void {
  stage.dataset.motion = "rail";
  const viewport = window.innerWidth;
  const height = stage.clientHeight;
  const total = track.scrollWidth;
  const travel = total - viewport;
  const nodes = pick<HTMLElement>(track, "[data-rail-node]");

  const undo = () => {
    runway.style.removeProperty("height");
    stage.dataset.motion = "static";
  };
  const trackLeft = track.getBoundingClientRect().left;
  const xs = nodes.map((node) => node.getBoundingClientRect().left - trackLeft);
  const pitch = nodes[0]?.offsetWidth ?? 0;
  if (travel <= 0 || xs.length === 0 || pitch === 0) {
    undo();
    return () => {};
  }

  runway.style.height = `${travel + height}px`;
  const amplitude = Math.min(height * AMPLITUDE_SHARE, AMPLITUDE_MAX_PX);
  const points = nodePoints(xs, amplitude, pitch, total);
  const wave = createWave(points);
  const end = points.at(-1)?.x ?? total;
  drawWaves(stage, { wave, pitch, total, end, height });

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

    for (const layer of pick<HTMLElement>(track, "[data-rail-parallax]")) {
      const reach = Number(layer.dataset.railParallax) * viewport;
      timeline.fromTo(layer, { x: reach }, { x: -reach, duration: travel }, 0);
    }

    // The head is where the drawing ends; the waves are clipped to it, a little behind for the echoes.
    const head = stage.querySelector<SVGGElement>("[data-rail-head]");
    const clips = pick<SVGRectElement>(stage, "[data-rail-clip]");
    const setHeadX = head && gsap.quickSetter(head, "x", "px");
    const setHeadY = head && gsap.quickSetter(head, "y", "px");
    const start = viewport * HEAD_START_SHARE;
    const playhead = { x: start };
    const render = () => {
      for (const clip of clips) {
        const lag = Number(clip.dataset.railLag) * pitch;
        clip.setAttribute("width", String(Math.max(0, playhead.x - lag)));
      }
      setHeadX?.(playhead.x);
      setHeadY?.(height / 2 + wave(playhead.x));
    };
    timeline.fromTo(playhead, { x: start }, { x: end, duration: travel, onUpdate: render }, 0);
    render();
    gsap.to("[data-rail-head-ring]", {
      scale: 2.2,
      opacity: 0,
      svgOrigin: "0 0",
      duration: 1.5,
      ease: "power2.out",
      repeat: -1,
    });

    // Each node is lit when the head reaches it; the label sits on the outer side of the curve.
    const lit = Math.min(180, travel * 0.05);
    nodes.forEach((node, index) => {
      const above = index % 2 === 0;
      const side = above ? -1 : 1;
      const dot = pick(node, "[data-rail-fill]");
      const label = pick(node, "[data-rail-label]");
      const stem = pick(node, "[data-rail-stem]");
      const arrival = Math.max(0, ((xs[index] ?? 0) - start) * (travel / (end - start)));

      gsap.set(node, { y: side * amplitude });
      gsap.set(label, { yPercent: above ? -100 : 0, y: side * STEM_PX });
      gsap.set(stem, {
        yPercent: above ? -100 : 0,
        transformOrigin: above ? "50% 100%" : "50% 0%",
      });
      timeline.fromTo(
        dot,
        { scale: 0 },
        { scale: 1, duration: lit, ease: "back.out(2.4)" },
        arrival,
      );
      timeline.fromTo(
        stem,
        { scaleY: 0 },
        { scaleY: 1, duration: lit, ease: "power3.out" },
        arrival,
      );
      timeline.fromTo(label, { x: 36 }, { x: 0, duration: lit * 1.6, ease: "power3.out" }, arrival);
    });
    // Without this the timeline ends with its last tween, and the scroll distance would shrink.
    timeline.set({}, {}, travel);
  }, stage);

  return () => {
    context.revert();
    undo();
  };
}
