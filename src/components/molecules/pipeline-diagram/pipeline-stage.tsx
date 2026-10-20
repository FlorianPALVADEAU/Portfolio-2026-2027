"use client";

import { Plus } from "lucide-react";
import { type PointerEvent, type ReactNode, useId, useRef, useState } from "react";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

type PipelineStageProps = {
  /** Position in the pipeline, from 1. */
  order: number;
  label: string;
  /** A sentence about the stage, opened by hovering, focusing or tapping the title. */
  note: string;
  /** The glyph of the stage, already rendered: a server component cannot hand over an icon component. */
  icon: ReactNode;
  /** The tools that run the stage. */
  children?: ReactNode;
};

/**
 * One stage of the pipeline. A soft light follows the pointer across the card, the icon turns, and
 * the title opens a note inside the card: on hover for a mouse, on tap or Enter otherwise.
 */
export function PipelineStage({ order, label, note, icon, children }: PipelineStageProps) {
  const [open, setOpen] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const noteId = useId();

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--py", `${event.clientY - box.top}px`);
  };

  return (
    <div
      ref={card}
      data-open={open || undefined}
      className="group/stage relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-background p-3 transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-1.5 hover:border-accent hover:shadow-lg data-open:border-accent md:gap-4 md:p-5"
      onPointerMove={follow}
      onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(220px_circle_at_var(--px,50%)_var(--py,0%),color-mix(in_oklch,var(--accent)_22%,transparent),transparent_70%)] opacity-0 transition-opacity duration-(--duration-base) group-hover/stage:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-(--duration-slow) group-hover/stage:scale-x-100 group-data-open/stage:scale-x-100"
      />
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent transition-[background-color,color,rotate,scale] duration-(--duration-base) ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/stage:-rotate-6 group-hover/stage:scale-110 group-hover/stage:bg-accent group-hover/stage:text-accent-foreground md:size-11">
        {icon}
      </span>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={noteId}
        onClick={() => setOpen((value) => !value)}
        className="relative flex cursor-pointer items-baseline gap-2 text-left text-lg font-semibold md:text-xl"
      >
        <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
          {String(order).padStart(2, "0")}
        </span>
        {label}
        <Icon
          icon={Plus}
          size="sm"
          className="ml-auto self-center text-muted-foreground transition-transform duration-(--duration-base) group-data-open/stage:rotate-45"
        />
      </button>
      <div
        id={noteId}
        className="relative grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-base) group-data-open/stage:grid-rows-[1fr] group-data-open/stage:opacity-100"
      >
        <Text size="sm" tone="muted" className="overflow-hidden text-pretty">
          {note}
        </Text>
      </div>
      {children}
    </div>
  );
}
