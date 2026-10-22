"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { jumpToTop } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Large screens that accept motion: the story runs sideways, pinned, driven by vertical scroll. */
const SIDEWAYS = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/** Panels grow from this share of their size while they slide in, picture un-zooming inside. */
const GROW_FROM = 0.84;
const ZOOM_FROM = 1.5;

/**
 * Lays its `data-story-panel` children in a row and turns vertical scroll into sideways travel
 * while the section is pinned. Anything marked `data-story-grow` grows as it enters, and the
 * `data-story-zoom` picture inside it un-zooms, like the covers of the works list without the
 * lean. Everywhere else, and without script, the panels simply stack and scroll like a page.
 * Focusing a panel that is out of sight scrolls the page to it, so the keyboard never gets lost.
 */
export function StoryRail({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = viewport.current;
    const row = track.current;
    if (!(frame && row)) return;

    const media = gsap.matchMedia();
    media.add(SIDEWAYS, () => {
      frame.dataset.rail = "on";
      const distance = () => Math.max(0, row.scrollWidth - frame.clientWidth);

      const slide = gsap.to(row, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          pin: true,
          scrub: 0.6,
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) gsap.set(progress.current, { scaleX: self.progress });
          },
        },
      });

      for (const element of gsap.utils.toArray<HTMLElement>("[data-story-grow]", row)) {
        const trigger = {
          trigger: element,
          containerAnimation: slide,
          start: "left 98%",
          end: "left 55%",
          scrub: 0.5,
        };
        gsap.fromTo(
          element,
          { scale: GROW_FROM },
          { scale: 1, ease: "power2.out", scrollTrigger: trigger },
        );
        const picture = element.querySelector<HTMLElement>("[data-story-zoom]");
        if (picture)
          gsap.fromTo(
            picture,
            { scale: ZOOM_FROM },
            { scale: 1, ease: "power2.out", scrollTrigger: trigger },
          );
      }

      const onFocus = (event: FocusEvent) => {
        const panel =
          event.target instanceof Element
            ? event.target.closest<HTMLElement>("[data-story-panel]")
            : null;
        const trigger = slide.scrollTrigger;
        if (!(panel && trigger)) return;
        const box = panel.getBoundingClientRect();
        if (box.left >= 0 && box.right <= window.innerWidth) return;
        const centred = panel.offsetLeft - (frame.clientWidth - panel.offsetWidth) / 2;
        jumpToTop(trigger.start + Math.min(Math.max(centred, 0), distance()));
      };
      row.addEventListener("focusin", onFocus);

      return () => {
        row.removeEventListener("focusin", onFocus);
        delete frame.dataset.rail;
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={viewport} className="group/rail relative overflow-x-clip">
      <div
        ref={track}
        className="relative flex flex-col gap-(--section-space) group-data-[rail=on]/rail:flex-row group-data-[rail=on]/rail:gap-0 group-data-[rail=on]/rail:will-change-transform"
      >
        {children}
      </div>
      <div
        ref={progress}
        aria-hidden="true"
        className="absolute bottom-0 left-0 hidden h-0.5 w-full origin-left scale-x-0 bg-accent group-data-[rail=on]/rail:block"
      />
    </div>
  );
}
