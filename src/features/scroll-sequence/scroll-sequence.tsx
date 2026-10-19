"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import type { FrameSources } from "@/lib/landing";
import { prefersReducedMotion } from "@/lib/motion";
import { createFramePlayer } from "./frame-player";

gsap.registerPlugin(ScrollTrigger);

/** Viewport heights of scrolling that play the whole sequence. */
const TRAVEL = 3;
/**
 * The stage stays stuck for one more viewport after the sequence, while the next section slides
 * over it. The track is tall enough for the sequence, that viewport and the stage itself; its
 * negative bottom margin pulls the next section up by that viewport, over the end of the track.
 */
const TRACK = `${(TRAVEL + 2) * 100}svh`;
/** Share of the sequence after which the revealed copy starts to appear. */
const REVEAL_AT = 0.72;
const SMALL_SCREEN = "(max-width: 767px)";

type ScrollSequenceProps = {
  frames: FrameSources | null;
  children: ReactNode;
};

/**
 * Holds a full-screen stage in place and plays a frame sequence while the visitor scrolls past.
 * Children marked `data-sequence-reveal` appear at the end of the sequence and those marked
 * `data-sequence-fade` leave at its start. Without frames a placeholder sky zooms out instead.
 * The next section must be opaque and above it (`z-10`). Under reduced motion the stage is not
 * held and does not overlap: the last frame and all the copy are shown at once.
 */
export function ScrollSequence({ frames, children }: ScrollSequenceProps) {
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sky = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = track.current;
    const surface = canvas.current;
    if (!(element && surface)) return;

    const set =
      frames && (window.matchMedia(SMALL_SCREEN).matches ? frames.mobile : frames.desktop);
    const player = set ? createFramePlayer(surface, set) : null;

    if (prefersReducedMotion()) {
      player?.show(1);
      return () => player?.destroy();
    }

    const context = gsap.context(() => {
      const state = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: () => `+=${window.innerHeight * TRAVEL}`,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        state,
        { progress: 1, duration: 1, onUpdate: () => player?.show(state.progress) },
        0,
      );
      if (!player) timeline.fromTo(sky.current, { scale: 2.4 }, { scale: 1, duration: 1 }, 0);
      timeline.to("[data-sequence-fade]", { autoAlpha: 0, duration: 0.12 }, 0);
      timeline.fromTo(
        "[data-sequence-reveal]",
        { opacity: 0, y: 56 },
        { opacity: 1, y: 0, duration: 1 - REVEAL_AT, stagger: 0.04, ease: "power2.out" },
        REVEAL_AT - 0.04,
      );
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
      className="-mb-[100svh] h-(--track) motion-reduce:mb-0 motion-reduce:h-svh"
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
        {children}
      </div>
    </div>
  );
}
