import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const sizes = {
  /** The opening screen: wide enough for the title beside the facts. */
  intro: "group-data-[rail=on]/rail:w-[min(92vw,90rem)]",
  /** Reading width: text, a short list. */
  text: "group-data-[rail=on]/rail:w-[min(88vw,64rem)]",
  /** Takes the width of what it holds: a picture sized to the screen height. */
  media:
    "group-data-[rail=on]/rail:w-auto group-data-[rail=on]/rail:px-[2vw] group-data-[rail=on]/rail:pt-24 group-data-[rail=on]/rail:pb-5",
} as const;

type StoryPanelProps = ComponentPropsWithoutRef<"section"> & {
  size?: keyof typeof sizes;
};

/**
 * One step of a project story. Stacked in the page flow by default; inside a pinned `StoryRail`
 * it becomes a screen-high column of its own. `data-story-panel` is the marker the rail reads.
 */
export function StoryPanel({ size = "text", className, ...props }: StoryPanelProps) {
  return (
    <section
      data-story-panel
      className={cn(
        "mx-auto flex w-full max-w-(--container-max) shrink-0 flex-col justify-center px-(--gutter) group-data-[rail=on]/rail:mx-0 group-data-[rail=on]/rail:h-dvh group-data-[rail=on]/rail:py-24 group-data-[rail=on]/rail:max-w-none group-data-[rail=on]/rail:px-[5vw]",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
