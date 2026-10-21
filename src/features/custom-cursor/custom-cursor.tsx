"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/atoms/icon";
import { startCursor } from "./cursor-engine";

type CustomCursorProps = {
  labels: { scroll: string; view: string };
};

const LABEL =
  "absolute inset-0 flex items-center justify-center gap-1.5 font-mono text-[0.625rem] tracking-widest text-background uppercase";

/**
 * The site's pointer: a dot with a fading tail that morphs over links, project cards and scroll
 * blocks. Mouse and trackpad only: on a touch screen nothing is drawn and nothing is hidden.
 * Purely decorative, so it is hidden from assistive technology and never takes focus or clicks.
 */
export function CustomCursor({ labels }: CustomCursorProps) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!(root.current && body.current && fill.current && canvas.current)) return;
    return startCursor({
      root: root.current,
      body: body.current,
      fill: fill.current,
      canvas: canvas.current,
    });
  }, []);

  return (
    <div aria-hidden="true">
      <canvas
        ref={canvas}
        className="pointer-events-none fixed inset-0 z-(--z-cursor) size-full text-foreground"
      />
      <div
        ref={root}
        className="pointer-events-none invisible fixed top-0 left-0 z-(--z-cursor) size-0"
      >
        <div
          ref={body}
          className="relative size-2.5 rounded-full border-[1.5px] border-foreground shadow-[0_0_0_1px_var(--background)]"
        >
          <span ref={fill} className="absolute inset-0 rounded-full bg-foreground" />
          <span data-cursor-label="scroll" className={LABEL}>
            {labels.scroll}
            <Icon icon={ArrowDown} size="sm" className="size-3" />
          </span>
          <span data-cursor-label="view" className={LABEL}>
            {labels.view}
          </span>
        </div>
      </div>
    </div>
  );
}
