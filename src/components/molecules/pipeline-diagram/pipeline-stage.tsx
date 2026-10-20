"use client";

import { Plus } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { FlipText } from "@/components/atoms/flip-text";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

type PipelineStageProps = {
  /** Position in the pipeline, from 1. */
  order: number;
  label: string;
  /** A sentence about the stage, opened by hovering, focusing or tapping the title. */
  note: string;
  /** The tools that run the stage. */
  children?: ReactNode;
};

/**
 * One stage of the pipeline, set as a big word on a rule with a node on it. The word rolls and
 * its note opens beneath: on hover for a mouse, on tap or Enter otherwise.
 */
export function PipelineStage({ order, label, note, children }: PipelineStageProps) {
  const [open, setOpen] = useState(false);
  const noteId = useId();

  return (
    <div
      data-open={open || undefined}
      className="group/stage flex h-full flex-col gap-3 md:gap-5"
      onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={noteId}
        onClick={() => setOpen((value) => !value)}
        className="flip-host flex cursor-pointer items-baseline gap-3 text-left"
      >
        <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
          {String(order).padStart(2, "0")}
        </span>
        <span className="text-4xl font-semibold tracking-tight transition-colors duration-(--duration-base) group-hover/stage:text-accent group-data-open/stage:text-accent md:text-[clamp(2rem,3.1vw,3.5rem)]">
          <FlipText>{label}</FlipText>
        </span>
        <Icon
          icon={Plus}
          size="sm"
          className="ml-auto self-center text-muted-foreground transition-transform duration-(--duration-base) group-data-open/stage:rotate-45 md:hidden"
        />
      </button>
      <div
        id={noteId}
        className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-base) group-data-open/stage:grid-rows-[1fr] group-data-open/stage:opacity-100"
      >
        <Text size="sm" tone="muted" className="overflow-hidden text-pretty md:max-w-[28ch]">
          {note}
        </Text>
      </div>
      {children}
    </div>
  );
}
