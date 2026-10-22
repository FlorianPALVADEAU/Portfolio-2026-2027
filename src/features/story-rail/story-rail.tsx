"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Large screens: the story is a row, scrolled sideways by the wheel, the touchpad or the keys. */
const SIDEWAYS = "(min-width: 1024px)";
const MOTION = "(prefers-reduced-motion: no-preference)";

/** Share of the remaining distance the wheel glide covers on each frame. */
const GLIDE = 0.18;
/** Wheel distance in px the row swallows at an end before the page starts to scroll... */
const END_RESISTANCE = 280;
/** ...and the time in ms it keeps swallowing it, so a fast flick cannot cut through. */
const END_DWELL_MS = 450;
/** Pause in ms after which that resistance starts over. */
const RESISTANCE_RESET_MS = 600;
/** Distance in px after which the cue that invites the visitor to scroll sideways goes away. */
const CUE_HIDDEN_AFTER = 40;
/** Panels grow from this share of their size while they slide in, picture un-zooming inside. */
const GROW_FROM = 0.84;
const ZOOM_FROM = 1.5;

/** Whether the wheel is still being held back at an end of the row; see the constants above. */
function endResistance() {
  let pushed = 0;
  let pushedAt = 0;
  let started = 0;
  return {
    holds(delta: number): boolean {
      const now = performance.now();
      if (now - pushedAt > RESISTANCE_RESET_MS) {
        pushed = 0;
        started = now;
      }
      pushedAt = now;
      pushed += Math.abs(delta);
      return pushed < END_RESISTANCE || now - started < END_DWELL_MS;
    },
  };
}

/**
 * Sends the vertical wheel along the row, eased. At either end the wheel goes back to the page,
 * so the footer stays within reach.
 */
function wheelSideways(row: HTMLElement): () => void {
  let target = row.scrollLeft;
  let frameId = 0;
  const resistance = endResistance();
  const reach = () => row.scrollWidth - row.clientWidth;
  const glide = () => {
    const gap = target - row.scrollLeft;
    if (Math.abs(gap) < 0.5) {
      row.scrollLeft = target;
      frameId = 0;
      return;
    }
    row.scrollLeft += gap * GLIDE;
    frameId = requestAnimationFrame(glide);
  };
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.ctrlKey) return;
    const from = frameId ? target : row.scrollLeft;
    const next = Math.min(Math.max(from + event.deltaY, 0), reach());
    if (next === from) {
      // The end of the story comes with a little give, so the last words are read before the
      // footer takes over.
      if (resistance.holds(event.deltaY)) event.preventDefault();
      return;
    }
    event.preventDefault();
    target = next;
    if (!frameId) frameId = requestAnimationFrame(glide);
  };
  // Keys, touch and drag move the row on their own; the glide must start from where they left it.
  const onScroll = () => {
    if (!frameId) target = row.scrollLeft;
  };
  row.addEventListener("wheel", onWheel, { passive: false });
  row.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    cancelAnimationFrame(frameId);
    row.removeEventListener("wheel", onWheel);
    row.removeEventListener("scroll", onScroll);
  };
}

/** Grows each `data-story-grow` as it enters the row, its `data-story-zoom` picture un-zooming. */
function growOnEnter(row: HTMLElement) {
  for (const element of gsap.utils.toArray<HTMLElement>("[data-story-grow]", row)) {
    const scrollTrigger = {
      trigger: element,
      scroller: row,
      horizontal: true,
      start: "left 98%",
      end: "left 55%",
      scrub: 0.5,
    };
    gsap.fromTo(element, { scale: GROW_FROM }, { scale: 1, ease: "power2.out", scrollTrigger });
    const picture = element.querySelector<HTMLElement>("[data-story-zoom]");
    if (picture) {
      gsap.fromTo(picture, { scale: ZOOM_FROM }, { scale: 1, ease: "power2.out", scrollTrigger });
    }
  }
}

/**
 * Lays its `data-story-panel` children in a row that scrolls sideways on large screens: the
 * browser's own horizontal scroll, so touch, touchpad, keys, focus and the scroll position all
 * behave natively and the page itself never moves. The wheel is turned sideways too. Elsewhere,
 * and without script, the panels stack and scroll like a page.
 */
export function StoryRail({ label, children }: { label: string; children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = frame.current;
    const row = scroller.current;
    if (!(outer && row)) return;

    const media = gsap.matchMedia();
    media.add({ sideways: SIDEWAYS, motion: MOTION }, (context) => {
      if (!context.conditions?.sideways) return;
      outer.dataset.rail = "on";
      // A page kept by the router comes back as it was left; a story starts from its beginning.
      row.scrollLeft = 0;
      // A scroller that cannot take focus leaves keyboard users no way to move along it.
      row.tabIndex = 0;
      // The sticky header takes room above the story; the story slides under it, so that the page
      // starts exactly on the story.
      outer.style.marginTop = `-${document.querySelector("header")?.getBoundingClientRect().height ?? 0}px`;

      const release = wheelSideways(row);
      const cue = row.querySelector<HTMLElement>("[data-story-cue]");
      const onKey = (event: KeyboardEvent) => {
        if (event.target !== row || (event.key !== "Home" && event.key !== "End")) return;
        event.preventDefault();
        row.scrollTo({
          left: event.key === "Home" ? 0 : row.scrollWidth,
          behavior: context.conditions?.motion ? "smooth" : "auto",
        });
      };
      row.addEventListener("keydown", onKey);
      const onScroll = () => {
        if (cue) cue.style.opacity = row.scrollLeft > CUE_HIDDEN_AFTER ? "0" : "";
        const reach = row.scrollWidth - row.clientWidth;
        if (progress.current) gsap.set(progress.current, { scaleX: row.scrollLeft / (reach || 1) });
      };
      row.addEventListener("scroll", onScroll, { passive: true });
      if (context.conditions?.motion) growOnEnter(row);

      return () => {
        release();
        row.removeEventListener("keydown", onKey);
        row.removeEventListener("scroll", onScroll);
        row.tabIndex = -1;
        delete outer.dataset.rail;
        outer.style.marginTop = "";
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div ref={frame} className="group/rail relative -mt-18">
      <section
        ref={scroller}
        // Lenis would otherwise smooth the wheel over the page while the row handles it.
        data-lenis-prevent=""
        aria-label={label}
        tabIndex={-1}
        className="[scrollbar-width:none] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring group-data-[rail=on]/rail:h-dvh group-data-[rail=on]/rail:overflow-x-auto group-data-[rail=on]/rail:overflow-y-hidden group-data-[rail=on]/rail:overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex flex-col gap-(--section-space) group-data-[rail=on]/rail:h-full group-data-[rail=on]/rail:w-[max-content] group-data-[rail=on]/rail:flex-row group-data-[rail=on]/rail:gap-0 group-data-[rail=on]/rail:pr-[30vw]">
          {children}
        </div>
      </section>
      <div
        ref={progress}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 hidden h-1 w-full origin-left scale-x-0 bg-accent group-data-[rail=on]/rail:block"
      />
    </div>
  );
}
