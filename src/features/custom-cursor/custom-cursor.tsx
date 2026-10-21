"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils";
import { startCursor } from "./cursor-engine";
import { ArrowShape, HandShape } from "./cursor-shapes";

type CustomCursorProps = {
  labels: { scroll: string; view: string };
};

const TAG =
  "absolute top-7 left-5 flex origin-top-left scale-0 items-center gap-1.5 rounded-full border border-background bg-accent px-3 py-1 font-mono text-[0.6875rem] tracking-widest whitespace-nowrap text-accent-foreground uppercase opacity-0 shadow-md transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none";
const TAG_SHOWN = {
  view: "group-data-[label=view]:scale-100 group-data-[label=view]:opacity-100",
  scroll: "group-data-[label=scroll]:scale-100 group-data-[label=scroll]:opacity-100",
};
const STREAK_ROWS = [-8, 0, 8] as const;

/**
 * The site's pointer, in the spirit of the old Macintosh: a cartoon arrow that turns into the
 * pointing hand over what can be clicked, with a tag for project cards and scroll blocks. The air
 * plays with it: it leans against the pointer's speed and thin streaks follow a fast flick.
 * Mouse and trackpad only: on a touch screen nothing is drawn and nothing is hidden. Purely
 * decorative, so it is hidden from assistive technology and never takes focus or clicks.
 */
export function CustomCursor({ labels }: CustomCursorProps) {
  const root = useRef<HTMLDivElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const streakGroup = useRef<SVGGElement>(null);
  const streaks = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const lines = streaks.current.filter((line): line is SVGLineElement => line !== null);
    if (!(root.current && swing.current && streakGroup.current)) return;
    return startCursor({
      root: root.current,
      swing: swing.current,
      streaks: lines,
      streakGroup: streakGroup.current,
    });
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-shape="hidden"
      data-label="none"
      className="group pointer-events-none invisible fixed top-0 left-0 z-(--z-cursor) size-0"
    >
      <svg
        aria-hidden="true"
        className="absolute top-0 left-0 overflow-visible stroke-white [filter:drop-shadow(0_0_1px_rgb(0_0_0/0.55))]"
        width="1"
        height="1"
      >
        <g ref={streakGroup}>
          {STREAK_ROWS.map((row, index) => (
            <line
              key={row}
              ref={(line) => {
                streaks.current[index] = line;
              }}
              x1="-14"
              x2="-14"
              y1={row + 9}
              y2={row + 9}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ opacity: 0 }}
            />
          ))}
        </g>
      </svg>
      <div
        ref={swing}
        className="origin-top-left transition-transform duration-150 group-data-pressed:scale-90"
      >
        <ArrowShape />
        <HandShape />
      </div>
      <span className={cn(TAG, TAG_SHOWN.view)}>{labels.view}</span>
      <span className={cn(TAG, TAG_SHOWN.scroll)}>
        {labels.scroll}
        <Icon icon={ArrowDown} size="sm" className="size-3" />
      </span>
    </div>
  );
}
