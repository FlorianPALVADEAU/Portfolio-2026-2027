"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { buildRail } from "./build-rail";

type FrameRailProps = {
  /** One label per `Frame`, in the same order; they name the segments of the bar. */
  frames: readonly { id: string; label: string }[];
  /** The title of the section, kept on screen while the frames slide by. */
  header: ReactNode;
  children: ReactNode;
};

/**
 * Stacks its frames, which is what remains without JavaScript or under reduced motion. Otherwise
 * the stage sticks to the top while the page scrolls and the track slides sideways, one full
 * screen per frame (see `buildRail`). The stage reports its mode in `data-motion`, which the
 * parts of the rail style themselves by.
 */
export function FrameRail({ frames, header, children }: FrameRailProps) {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const parts = { runway: runway.current, stage: stage.current, track: track.current };
    if (!(parts.runway && parts.stage && parts.track)) return;
    const rail = { runway: parts.runway, stage: parts.stage, track: parts.track };

    let teardown = () => {};
    let built = "";
    const signature = () => `${rail.stage.clientWidth}:${rail.track.scrollWidth}`;
    const mount = () => {
      teardown();
      teardown = prefersReducedMotion() ? () => {} : buildRail(rail);
      built = signature();
    };

    mount();
    // Fonts and viewport changes move the frames, so the rail is measured and built again.
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
        className="relative py-(--section-space) data-[motion=rail]:sticky data-[motion=rail]:top-0 data-[motion=rail]:h-svh data-[motion=rail]:overflow-hidden data-[motion=rail]:py-0"
      >
        <div className="mx-auto mb-12 max-w-(--container-max) px-(--gutter) in-data-[motion=rail]:absolute in-data-[motion=rail]:inset-x-0 in-data-[motion=rail]:top-6 in-data-[motion=rail]:z-10 in-data-[motion=rail]:mb-0 in-data-[motion=rail]:max-w-none">
          {header}
        </div>
        <div
          ref={track}
          className="mx-auto flex max-w-(--container-max) flex-col gap-24 in-data-[motion=rail]:mx-0 in-data-[motion=rail]:h-full in-data-[motion=rail]:w-[max-content] in-data-[motion=rail]:max-w-none in-data-[motion=rail]:flex-row in-data-[motion=rail]:gap-0"
        >
          {children}
        </div>
        <ol
          aria-hidden="true"
          className="absolute inset-x-(--gutter) bottom-6 z-10 hidden gap-3 in-data-[motion=rail]:flex"
        >
          {frames.map(({ id, label }, order) => (
            <li key={id} className="flex flex-1 flex-col gap-2 font-mono text-xs">
              <span className="truncate">
                {String(order + 1).padStart(2, "0")}
                <span className="hidden md:inline">{` ${label}`}</span>
              </span>
              <span className="block h-px bg-border">
                <span data-frame-fill className="block size-full origin-left bg-foreground" />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
