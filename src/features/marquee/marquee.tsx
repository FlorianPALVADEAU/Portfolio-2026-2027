"use client";

import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LOOP_SECONDS = 40;

type MarqueeProps = {
  items: readonly string[];
  label: string;
  pauseLabel: string;
  playLabel: string;
};

function Items({ items, hidden }: { items: readonly string[]; hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-10 pr-10 group-data-[motion=static]:flex-wrap",
        hidden && "group-data-[motion=static]:hidden",
      )}
    >
      {items.map((item) => (
        <li key={item} className="text-lg whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Slow, endless band of keywords. The track holds two copies so a -50% shift loops seamlessly;
 * the copy is hidden from assistive technology. Hovering or focusing inside pauses it, and a
 * button gives keyboard users the same control. Reduced motion shows one static, wrapping list.
 */
export function Marquee({ items, label, pauseLabel, playLabel }: MarqueeProps) {
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
        duration: LOOP_SECONDS,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => {
      tween.current = null;
      context.revert();
    };
  }, []);

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
    <section aria-label={label} className="relative bg-background px-(--gutter) py-6">
      <div ref={root} data-motion="static" className="group flex items-center gap-4">
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <div ref={track} className="flex w-max group-data-[motion=static]:w-auto">
            <Items items={items} />
            <Items items={items} hidden />
          </div>
        </div>
        {animated && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setUserPaused((paused) => !paused)}
            className="shrink-0"
          >
            {userPaused ? playLabel : pauseLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
