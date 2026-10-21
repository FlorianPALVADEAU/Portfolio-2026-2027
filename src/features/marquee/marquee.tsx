"use client";

import { gsap } from "gsap";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DEFAULT_LOOP_SECONDS = 40;
const DEFAULT_ITEM_CLASS = "font-mono text-sm tracking-wide whitespace-nowrap uppercase";

type MarqueeItem = { id: string; content: ReactNode };

type MarqueeProps = {
  items: readonly MarqueeItem[];
  label: string;
  pauseLabel: string;
  playLabel: string;
  className?: string;
  /** Time of one full loop. */
  seconds?: number;
  /** Classes of each item; replaces the small uppercase mono default. */
  itemClassName?: string;
  /** Classes of the pause button, for a ground the default outline does not suit. */
  controlClassName?: string;
  /** Fades both ends of the band on wide screens. */
  fade?: boolean;
};

function Items({
  items,
  itemClassName,
  hidden,
}: {
  items: readonly MarqueeItem[];
  itemClassName: string;
  hidden?: boolean;
}) {
  return (
    <ul
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
 * Slow, endless band of keywords or logos. The track holds two copies so a -50% shift loops seamlessly;
 * the copy is hidden from assistive technology. Hovering or focusing inside pauses it, and a
 * button gives keyboard users the same control. Reduced motion shows one static, wrapping list.
 */
export function Marquee({
  items,
  label,
  pauseLabel,
  playLabel,
  className,
  seconds = DEFAULT_LOOP_SECONDS,
  itemClassName = DEFAULT_ITEM_CLASS,
  controlClassName,
  fade = false,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [animated, setAnimated] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);

  useLayoutEffect(() => {
    const element = track.current;
    if (!(element && root.current)) return;
    if (prefersReducedMotion()) {
      root.current.dataset.motion = "static";
      return;
    }

    root.current.dataset.motion = "loop";
    setAnimated(true);
    const context = gsap.context(() => {
      tween.current = gsap.to(element, {
        xPercent: -50,
        duration: seconds,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => {
      tween.current = null;
      context.revert();
    };
  }, [seconds]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const engage = () => setEngaged(true);
    const release = () => setEngaged(false);
    const events = [
      ["pointerenter", engage],
      ["pointerleave", release],
      ["focusin", engage],
      ["focusout", release],
    ] as const;
    for (const [name, handler] of events) element.addEventListener(name, handler);
    return () => {
      for (const [name, handler] of events) element.removeEventListener(name, handler);
    };
  }, []);

  useEffect(() => {
    tween.current?.paused(userPaused || engaged);
  }, [userPaused, engaged]);

  return (
    <section
      aria-label={label}
      className={cn("relative border-y border-border bg-background px-(--gutter) py-6", className)}
    >
      <div ref={root} data-motion="static" className="group flex items-center gap-4">
        <div
          className={cn(
            "flex min-w-0 flex-1 overflow-hidden",
            fade &&
              "md:[mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]",
          )}
        >
          <div ref={track} className="flex w-max group-data-[motion=static]:w-auto">
            <Items items={items} itemClassName={itemClassName} />
            <Items items={items} itemClassName={itemClassName} hidden />
          </div>
        </div>
        {animated && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUserPaused((paused) => !paused)}
            className={cn("shrink-0", controlClassName)}
          >
            {userPaused ? playLabel : pauseLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
