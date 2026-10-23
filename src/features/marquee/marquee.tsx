"use client";

import { gsap } from "gsap";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DEFAULT_SPEED = 60;
const DEFAULT_ITEM_CLASS = "font-mono text-sm tracking-wide whitespace-nowrap uppercase";
/** Share of the scroll speed added to the band's own speed. */
const SCROLL_GAIN = 0.6;
/** Ceiling of the speed added by scrolling, so a hard flick never turns the band into a blur. */
const MAX_BOOST = 2400;
/** How fast the boost follows the scroll speed, per second: higher is snappier, lower glides longer. */
const FOLLOW = 6;
/** How fast the band eases to a stop or back to speed on hover, per second. */
const PACE_FOLLOW = 5;
/** A frame longer than this (a hidden tab, a long task) never makes the band jump. */
const MAX_FRAME_SECONDS = 0.1;

type MarqueeItem = { id: string; content: ReactNode };

type MarqueeProps = {
  items: readonly MarqueeItem[];
  label: string;
  className?: string;
  /** Pixels per second when the page is not scrolling. */
  speed?: number;
  /** Classes of each item; replaces the small uppercase mono default. */
  itemClassName?: string;
  /** Fades both ends of the band on wide screens. */
  fade?: boolean;
};

function Items({
  items,
  itemClassName,
  hidden,
  copyRef,
}: {
  items: readonly MarqueeItem[];
  itemClassName: string;
  hidden?: boolean;
  copyRef?: React.Ref<HTMLUListElement>;
}) {
  return (
    <ul
      ref={copyRef}
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-10 pr-10 group-data-[motion=static]:flex-wrap",
        hidden && "group-data-[motion=static]:hidden",
      )}
    >
      {items.map(({ id, content }) => (
        <li key={id} className={itemClassName}>
          {content}
        </li>
      ))}
    </ul>
  );
}

/**
 * Endless band of keywords or logos. The track holds as many copies as it takes to cover the
 * band plus one, and every frame it moves by a distance that is wrapped to the width of one copy,
 * so the copy that leaves is exactly the copy that enters and nothing ever jumps. It runs at its
 * own speed and goes faster the faster the page scrolls; it eases to a stop while a mouse is over the band. The copies are hidden from assistive
 * technology; reduced motion shows one static, wrapping list.
 */
export function Marquee({
  items,
  label,
  className,
  speed = DEFAULT_SPEED,
  itemClassName = DEFAULT_ITEM_CLASS,
  fade = false,
}: MarqueeProps) {
  const frame = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(2);

  useLayoutEffect(() => {
    const band = viewport.current;
    const strip = track.current;
    const first = copy.current;
    const hover = frame.current;
    if (!(band && strip && first && hover && root.current)) return;
    if (prefersReducedMotion()) {
      root.current.dataset.motion = "static";
      return;
    }
    root.current.dataset.motion = "loop";

    let width = first.getBoundingClientRect().width;
    let visible = true;
    let offset = 0;
    let lastScroll = window.scrollY;
    let boost = 0;
    let pace = 1;
    let paceTarget = 1;

    const measure = () => {
      width = first.getBoundingClientRect().width;
      if (width > 0) setCopies(Math.max(2, Math.ceil(band.clientWidth / width) + 1));
    };
    measure();

    const tick = (_time: number, delta: number) => {
      const seconds = Math.min(delta / 1000, MAX_FRAME_SECONDS);
      const scrolled = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      if (!visible || width === 0 || seconds === 0) return;

      const target = Math.min((scrolled / seconds) * SCROLL_GAIN, MAX_BOOST);
      boost += (target - boost) * (1 - Math.exp(-FOLLOW * seconds));
      pace += (paceTarget - pace) * (1 - Math.exp(-PACE_FOLLOW * seconds));
      offset = (offset + (speed + boost) * pace * seconds) % width;
      strip.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };
    gsap.ticker.add(tick);

    const resize = new ResizeObserver(measure);
    resize.observe(band);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    intersection.observe(band);

    // Touch has no hover: a finger resting on the band would stop it with nothing to release it.
    const hold = (event: PointerEvent) => {
      if (event.pointerType === "mouse") paceTarget = 0;
    };
    const release = () => {
      paceTarget = 1;
    };
    // The whole band, padding included, is the target: not only the height of a logo or a word.
    hover.addEventListener("pointerenter", hold);
    hover.addEventListener("pointerleave", release);

    return () => {
      hover.removeEventListener("pointerenter", hold);
      hover.removeEventListener("pointerleave", release);
      gsap.ticker.remove(tick);
      resize.disconnect();
      intersection.disconnect();
      strip.style.transform = "";
    };
  }, [speed]);

  return (
    <section
      ref={frame}
      aria-label={label}
      className={cn("relative border-y border-border bg-background px-(--gutter) py-6", className)}
    >
      <div ref={root} data-motion="static" className="group">
        <div
          ref={viewport}
          className={cn(
            "flex min-w-0 overflow-hidden",
            fade &&
              "md:[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]",
          )}
        >
          <div
            ref={track}
            className="flex w-max will-change-transform group-data-[motion=static]:w-auto"
          >
            <Items items={items} itemClassName={itemClassName} copyRef={copy} />
            {Array.from({ length: copies - 1 }, (_, index) => (
              <Items
                // The copies never reorder, so their position is a stable key.
                // biome-ignore lint/suspicious/noArrayIndexKey: see above
                key={index}
                items={items}
                itemClassName={itemClassName}
                hidden
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
