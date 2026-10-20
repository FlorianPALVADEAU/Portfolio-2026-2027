"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { buildRail } from "./build-rail";

type CardRailProps = {
  /** One per `RailChapter`, in the same order; labels the segments of the chapter bar. */
  chapters: readonly { id: string; label: string }[];
  children: ReactNode;
};

/**
 * Lays its children out in a vertical stack, which is what remains without JavaScript or under
 * reduced motion. Otherwise the stage sticks to the top while the page scrolls and the track
 * slides sideways, bending its cards around the viewer (see `buildRail`). The stage reports its
 * mode in `data-motion`, which the parts of the rail style themselves by.
 */
export function CardRail({ chapters, children }: CardRailProps) {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

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
    // Fonts and viewport changes move the cards, so the rail is measured and built again.
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
        className="relative py-(--section-space) [--card-gap:1rem] [--card-width:clamp(15rem,66vw,18rem)] md:[--card-gap:1.5rem] md:[--card-width:clamp(16rem,21vw,22rem)] data-[motion=rail]:sticky data-[motion=rail]:top-0 data-[motion=rail]:h-svh data-[motion=rail]:overflow-hidden data-[motion=rail]:py-0 data-[motion=rail]:perspective-[1000px]"
      >
        <div
          aria-hidden="true"
          data-rail-spot
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(560px_circle_at_var(--mx,50%)_var(--my,50%),color-mix(in_oklch,var(--accent)_16%,transparent),transparent_70%)] in-data-[motion=rail]:block"
        />
        <div
          ref={track}
          className="mx-auto flex max-w-(--container-max) flex-col gap-24 px-(--gutter) in-data-[motion=rail]:relative in-data-[motion=rail]:mx-0 in-data-[motion=rail]:h-full in-data-[motion=rail]:w-[max-content] in-data-[motion=rail]:max-w-none in-data-[motion=rail]:transform-3d in-data-[motion=rail]:flex-row in-data-[motion=rail]:gap-0 in-data-[motion=rail]:px-0"
        >
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
              <span className="block h-px bg-border">
                <span
                  data-rail-chapter-fill
                  className="block size-full origin-left bg-foreground"
                />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
