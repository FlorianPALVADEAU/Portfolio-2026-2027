"use client";

import { type ReactNode, useId, useLayoutEffect, useRef } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { buildRail } from "./build-rail";

/** Distance by which each drawn line trails the head, in node widths. */
const CLIP_LAGS = [0, 0.9, 1.6];

/**
 * Lays its slides out in a vertical stack, which is what remains without JavaScript or under
 * reduced motion. Otherwise the stage sticks to the top while the page scrolls, the track slides
 * sideways and a wave is drawn through the nodes of its slides (see `buildRail`). The stage
 * reports its mode in `data-motion`, which slides and nodes style themselves by.
 */
export function WaveRail({ children }: { children: ReactNode }) {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const clipId = `${useId().replaceAll(":", "")}-reveal`;

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
        className="relative py-(--section-space) [--rail-pitch:clamp(14rem,62vw,22rem)] md:[--rail-pitch:clamp(18rem,26vw,26rem)] data-[motion=rail]:sticky data-[motion=rail]:top-0 data-[motion=rail]:h-svh data-[motion=rail]:overflow-hidden data-[motion=rail]:py-0"
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
              {CLIP_LAGS.map((lag, index) => (
                <clipPath key={lag} id={`${clipId}-${String(index)}`}>
                  <rect data-rail-clip data-rail-lag={lag} x="0" y="0" width="0" height="100%" />
                </clipPath>
              ))}
            </defs>
            <path data-rail-wave fill="none" stroke="var(--border)" strokeWidth="1.5" />
            <path
              data-rail-wave
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              clipPath={`url(#${clipId}-0)`}
            />
            <path
              data-rail-wave
              fill="none"
              stroke="var(--accent)"
              strokeOpacity="0.4"
              strokeWidth="1"
              clipPath={`url(#${clipId}-1)`}
            />
            <path
              data-rail-wave
              fill="none"
              stroke="var(--accent)"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="2 7"
              strokeLinecap="round"
              clipPath={`url(#${clipId}-2)`}
            />
            <g data-rail-head>
              <circle
                data-rail-head-ring
                r="9"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <circle r="5" fill="var(--accent)" />
            </g>
          </svg>
          {children}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-px bg-border in-data-[motion=rail]:block"
        >
          <div data-rail-progress className="size-full origin-left bg-accent" />
        </div>
      </div>
    </div>
  );
}
