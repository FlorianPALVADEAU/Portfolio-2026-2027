"use client";

import { type ReactNode, useId, useLayoutEffect, useRef } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { buildRail, FADE_PX } from "./build-rail";

/**
 * Lays its slides out in a vertical stack, which is what remains without JavaScript or under
 * reduced motion. Otherwise the stage sticks to the top while the page scrolls, the track slides
 * sideways and a wave is drawn behind its slides (see `buildRail`). The stage
 * reports its mode in `data-motion`, which slides and nodes style themselves by.
 */
type WaveRailProps = {
  /** One per slide that has a `tone`, in the same order; labels the segments of the chapter bar. */
  chapters: readonly { id: string; label: string }[];
  children: ReactNode;
};

export function WaveRail({ chapters, children }: WaveRailProps) {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const clipId = `${useId().replaceAll(":", "")}-wave`;

  useLayoutEffect(() => {
    const parts = { runway: runway.current, stage: stage.current, track: track.current };
    if (!(parts.runway && parts.stage && parts.track)) return;
    const rail = { runway: parts.runway, stage: parts.stage, track: parts.track };

    let teardown = () => {};
    let built = "";
    const signature = () => `${window.innerWidth}:${rail.track.scrollWidth}`;
    const mount = () => {
      teardown();
      teardown = prefersReducedMotion() ? () => {} : buildRail(rail);
      built = signature();
    };

    mount();
    // Fonts and viewport changes move the nodes, so the rail is measured and drawn again.
    const observer = new ResizeObserver(() => {
      if (signature() !== built) mount();
    });
    observer.observe(rail.stage);
    observer.observe(rail.track);
    const stopListening = onReducedMotionChange(mount);

    return () => {
      observer.disconnect();
      stopListening();
      teardown();
    };
  }, []);

  return (
    <div ref={runway}>
      <div
        ref={stage}
        data-motion="static"
        className="relative py-(--section-space) [--rail-pitch:clamp(9rem,42vw,13rem)] md:[--rail-pitch:clamp(11rem,15vw,16rem)] data-[motion=rail]:sticky data-[motion=rail]:top-0 data-[motion=rail]:h-svh data-[motion=rail]:overflow-hidden data-[motion=rail]:py-0"
      >
        <div
          ref={track}
          className="mx-auto flex max-w-(--container-max) flex-col gap-20 px-(--gutter) in-data-[motion=rail]:relative in-data-[motion=rail]:mx-0 in-data-[motion=rail]:h-full in-data-[motion=rail]:w-[max-content] in-data-[motion=rail]:max-w-none in-data-[motion=rail]:flex-row in-data-[motion=rail]:gap-0 in-data-[motion=rail]:px-0"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute inset-0 hidden size-full in-data-[motion=rail]:block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`${clipId}-fade`}>
                <stop offset="0" stopColor="white" />
                <stop offset="1" stopColor="black" />
              </linearGradient>
              <mask id={clipId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                <rect data-rail-reveal-solid x="0" y="0" width="0" height="100%" fill="white" />
                <rect
                  data-rail-reveal-fade
                  x="0"
                  y="0"
                  width={FADE_PX}
                  height="100%"
                  fill={`url(#${clipId}-fade)`}
                />
              </mask>
            </defs>
            <linearGradient id={`${clipId}-tint`} data-rail-tint gradientUnits="userSpaceOnUse" />
            <g
              mask={`url(#${clipId})`}
              fill="none"
              stroke={`url(#${clipId}-tint)`}
              strokeLinejoin="round"
            >
              <path data-rail-wave data-rail-band strokeOpacity="0.12" />
              <path data-rail-wave strokeOpacity="0.4" strokeWidth="1.5" />
            </g>
          </svg>
          {children}
        </div>
        <ol
          aria-hidden="true"
          data-rail-hud
          className="absolute inset-x-(--gutter) bottom-6 z-10 hidden gap-3 in-data-[motion=rail]:flex"
        >
          {chapters.map(({ id, label }, order) => (
            <li key={id} className="flex flex-1 flex-col gap-2 font-mono text-xs">
              <span className="truncate">
                {String(order + 1).padStart(2, "0")}
                <span className="hidden md:inline">{` ${label}`}</span>
              </span>
              <span className="block h-0.5 bg-border">
                <span data-rail-chapter-fill className="block size-full origin-left" />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
