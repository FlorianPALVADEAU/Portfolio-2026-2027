"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import type { FrameSources } from "@/lib/landing";
import { prefersReducedMotion } from "@/lib/motion";
import { createFramePlayer } from "./frame-player";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pixels of scrolling that play the whole sequence, with the copy still hidden. Shorter on small
 * screens, where a thumb covers less distance. The track height in CSS must use the same values.
 */
const SEQUENCE_PX = { small: 2000, large: 3000 };
/** Pixels of scrolling, after the sequence, that reveal the copy. */
const REVEAL_PX = 700;
/** Pixels of scrolling, once the copy is shown, that keep it alone on screen before the next section. */
const HOLD_PX = 1000;
/** Pixels over which the picture darkens, so that the copy can be read over the last frames. */
const DARKEN_PX = 1400;
const DARKEN_FROM = 0.3;
const DARKEN_TO = 0.85;
/**
 * The stage stays stuck for one more viewport after the scrolling, while the next section slides
 * over it. The track is tall enough for the scrolling, that viewport and the stage itself; its
 * negative bottom margin pulls the next section up by that viewport, over the end of the track.
 */
const TRACK = `calc(var(--sequence) + ${REVEAL_PX + HOLD_PX}px + 200svh)`;
const SMALL_SCREEN = "(max-width: 767px)";

type ScrollSequenceProps = {
  frames: FrameSources | null;
  children: ReactNode;
};

/**
 * Holds a full-screen stage in place and plays a frame sequence while the visitor scrolls past.
 * Children marked `data-sequence-reveal` appear once the sequence has played and those marked
 * `data-sequence-fade` leave at its start; those marked `data-sequence-photo` pop in with a
 * bounce, so they should rest on a wrapper that holds their tilt. A shade darkens the picture towards
 * the end so the copy stays readable. Without frames a placeholder sky zooms out instead.
 * The next section must be opaque and above it (`z-10`). Under reduced motion the stage is not
 * held and does not overlap: the last frame and all the copy are shown at once.
 */
export function ScrollSequence({ frames, children }: ScrollSequenceProps) {
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = track.current;
    const surface = canvas.current;
    if (!(element && surface)) return;

    const small = window.matchMedia(SMALL_SCREEN).matches;
    const sequencePx = small ? SEQUENCE_PX.small : SEQUENCE_PX.large;
    const set = frames && (small ? frames.mobile : frames.desktop);
    const player = set ? createFramePlayer(surface, set) : null;

    if (prefersReducedMotion()) {
      player?.show(1);
      return () => player?.destroy();
    }

    const context = gsap.context(() => {
      // Every position and duration below is in pixels of scrolling.
      const state = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: `+=${sequencePx + REVEAL_PX + HOLD_PX}`,
          scrub: 0.4,
        },
      });

      timeline.to(
        state,
        { progress: 1, duration: sequencePx, onUpdate: () => player?.show(state.progress) },
        0,
      );
      if (!player) {
        timeline.fromTo(sky.current, { scale: 2.4 }, { scale: 1, duration: sequencePx }, 0);
      }
      timeline.fromTo(
        shade.current,
        { opacity: DARKEN_FROM },
        { opacity: DARKEN_TO, duration: DARKEN_PX },
        sequencePx - DARKEN_PX + 200,
      );
      timeline.to("[data-sequence-fade]", { autoAlpha: 0, duration: 400 }, 0);
      timeline.fromTo(
        "[data-sequence-reveal]",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 300, stagger: 40, ease: "power2.out" },
        sequencePx,
      );
      for (const [order, photo] of gsap.utils
        .toArray<HTMLElement>("[data-sequence-photo]")
        .entries()) {
        timeline.fromTo(
          photo,
          { opacity: 0, scale: 0.6, y: 90, rotation: -14 },
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 300, ease: "back.out(1.7)" },
          sequencePx + 60 + order * 60,
        );
      }
      // Without this the timeline ends with its last tween, and the hold would stretch it.
      timeline.set({}, {}, sequencePx + REVEAL_PX + HOLD_PX);
    }, element);

    return () => {
      context.revert();
      player?.destroy();
    };
  }, [frames]);

  return (
    <div
      ref={track}
      style={{ "--track": TRACK } as CSSProperties}
      className="-mb-[100svh] [--sequence:3000px] md:[--sequence:5000px] h-(--track) motion-reduce:mb-0 motion-reduce:h-svh"
    >
      <div className="sticky top-0 h-svh overflow-hidden motion-reduce:static">
        <div aria-hidden="true" className="absolute inset-0">
          <canvas ref={canvas} className="size-full" />
        </div>
        {!frames && (
          <div
            ref={sky}
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,#fff_0%,#8a8a8a_24%,#1a1a1a_58%,#000_82%)]"
          />
        )}
        <div ref={shade} aria-hidden="true" className="absolute inset-0 bg-black opacity-85" />
        {children}
      </div>
    </div>
  );
}
