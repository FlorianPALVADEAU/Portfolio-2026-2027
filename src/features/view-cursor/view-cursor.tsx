"use client";

import { ArrowUpRight } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { PointerTag } from "@/components/atoms/pointer-tag";
import { hasFinePointer, prefersReducedMotion, trailPointer } from "@/lib/motion";

const VIEW_CURSOR_ATTRIBUTE = "data-view-cursor";

type ViewCursorProps = {
  label: string;
  children: ReactNode;
};

/**
 * A "view" tag that trails the pointer over any descendant marked with `data-view-cursor`, beside
 * the native pointer, which stays. It is a pointer nicety only: the marked elements stay ordinary
 * links, so touch, keyboard and reduced-motion visitors lose nothing and never see the tag.
 */
export function ViewCursor({ label, children }: ViewCursorProps) {
  const root = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    const element = tag.current;
    if (!(container && element && hasFinePointer()) || prefersReducedMotion()) return;

    const follower = trailPointer(element);
    const onMove = (event: PointerEvent) => {
      follower.move(event.clientX, event.clientY);
      follower.show((event.target as Element).closest(`[${VIEW_CURSOR_ATTRIBUTE}]`) !== null);
    };
    const onLeave = () => follower.show(false);

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      follower.release();
    };
  }, []);

  return (
    <div ref={root}>
      {children}
      <PointerTag ref={tag} anchor="pointer" icon={ArrowUpRight}>
        {label}
      </PointerTag>
    </div>
  );
}
