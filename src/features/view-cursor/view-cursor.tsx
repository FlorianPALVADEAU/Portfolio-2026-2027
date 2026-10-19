"use client";

import { gsap } from "gsap";
import { type ReactNode, useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const VIEW_CURSOR_ATTRIBUTE = "data-view-cursor";

type ViewCursorProps = {
  label: string;
  children: ReactNode;
};

/**
 * A round label that trails the pointer over any descendant marked with `data-view-cursor`.
 * It is a pointer nicety only: the marked elements stay ordinary links, so touch, keyboard and
 * reduced-motion visitors lose nothing and never see the bubble.
 */
export function ViewCursor({ label, children }: ViewCursorProps) {
  const root = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = root.current;
    const element = bubble.current;
    if (!(container && element)) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    const moveX = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
    const moveY = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });
    const show = (visible: boolean) =>
      gsap.to(element, { scale: visible ? 1 : 0, duration: 0.3, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const over = (event.target as Element).closest(`[${VIEW_CURSOR_ATTRIBUTE}]`) !== null;
      show(over);
      moveX(event.clientX);
      moveY(event.clientY);
    };
    const onLeave = () => show(false);

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <div ref={root}>
      {children}
      <span
        ref={bubble}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-(--z-overlay) -mt-12 -ml-12 flex size-24 scale-0 items-center justify-center bg-accent text-sm font-medium text-accent-foreground"
      >
        {label}
      </span>
    </div>
  );
}
