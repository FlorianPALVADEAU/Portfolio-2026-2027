"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import {
  NATIVE_SCROLL_ATTRIBUTE,
  onReducedMotionChange,
  PHONE_QUERY,
  prefersReducedMotion,
} from "@/lib/motion";
import { buildRail } from "./build-rail";

type FrameRailProps = {
  /** One label per `Frame`, in the same order; they name the segments of the bar. */
  frames: readonly { id: string; label: string }[];
  /** Names the bar, which doubles as navigation: each segment scrolls to its frame. */
  navLabel: string;
  children: ReactNode;
};

/**
 * Stacks its frames, which is what remains without JavaScript, under reduced motion and on a phone, where nothing moves sideways. Otherwise
 * the stage sticks to the top while the page scrolls and the track slides sideways, one full
 * screen per frame, with a pause before the first and after the last (see `buildRail`). The stage reports its mode in `data-motion`, which the
 * parts of the rail style themselves by.
 */
export function FrameRail({ frames, navLabel, children }: FrameRailProps) {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const goTo = useRef<(order: number) => void>(() => {});

  useLayoutEffect(() => {
    const parts = { runway: runway.current, stage: stage.current, track: track.current };
    if (!(parts.runway && parts.stage && parts.track)) return;
    const rail = { runway: parts.runway, stage: parts.stage, track: parts.track };

    const phone = window.matchMedia(PHONE_QUERY);
    let teardown = () => {};
    let built = "";
    const contents = Array.from(rail.track.querySelectorAll("[data-frame] > div"));
    // Which frames overflow decides which ones the keyboard must be able to reach.
    const overflowing = () =>
      Array.from(rail.track.querySelectorAll("[data-frame]")).filter(
        (frame) => frame.scrollHeight > frame.clientHeight,
      ).length;
    const signature = () => `${rail.stage.clientWidth}:${rail.track.scrollWidth}:${overflowing()}`;
    const mount = () => {
      teardown();
      const active = prefersReducedMotion() || phone.matches ? null : buildRail(rail);
      teardown = active?.destroy ?? (() => {});
      goTo.current = active?.goTo ?? (() => {});
      built = signature();
    };

    mount();
    // Fonts and viewport changes move the frames, so the rail is measured and built again.
    const observer = new ResizeObserver(() => {
      if (signature() !== built) mount();
    });
    observer.observe(rail.stage);
    observer.observe(rail.track);
    for (const content of contents) observer.observe(content);
    const stopListening = onReducedMotionChange(mount);
    phone.addEventListener("change", mount);

    return () => {
      observer.disconnect();
      stopListening();
      phone.removeEventListener("change", mount);
      teardown();
    };
  }, []);

  return (
    <div ref={runway} {...{ [NATIVE_SCROLL_ATTRIBUTE]: "" }}>
      <div
        ref={stage}
        data-motion="static"
        className="relative py-(--section-space) data-[motion=rail]:sticky data-[motion=rail]:top-0 data-[motion=rail]:h-svh data-[motion=rail]:overflow-hidden data-[motion=rail]:py-0"
      >
        <div
          ref={track}
          className="mx-auto flex max-w-(--container-max) flex-col gap-16 md:gap-24 in-data-[motion=rail]:mx-0 in-data-[motion=rail]:h-full in-data-[motion=rail]:w-[max-content] in-data-[motion=rail]:max-w-none in-data-[motion=rail]:flex-row in-data-[motion=rail]:gap-0"
        >
          {children}
        </div>
        <nav
          aria-label={navLabel}
          data-rail-hud
          className="absolute inset-x-(--gutter) bottom-1 z-10 max-md:bottom-4 hidden in-data-[motion=rail]:block"
        >
          <ol className="flex gap-3">
            {frames.map(({ id, label }, order) => (
              <li key={id} className="flex-1">
                <button
                  type="button"
                  onClick={() => goTo.current(order)}
                  className="group/step flex min-h-12 w-full cursor-pointer flex-col justify-end gap-2 text-left font-mono text-xs"
                >
                  <span className="truncate max-lg:sr-only">
                    {String(order + 1).padStart(2, "0")}
                    {` ${label}`}
                  </span>
                  <span className="block h-0.5 bg-foreground/25 transition-[height] duration-(--duration-fast) group-hover/step:h-1 max-md:h-2 max-md:rounded-full">
                    <span
                      data-frame-fill
                      className="block size-full origin-left bg-foreground max-md:rounded-full"
                    />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
