import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * How an element arrives when the frame it sits in is revealed: `pop` overshoots like a spring,
 * `wipe` uncovers it from the left.
 */
const origins = {
  rise: "in-data-[reveal=off]:translate-y-8 in-data-[reveal=off]:opacity-0",
  scale: "in-data-[reveal=off]:scale-75 in-data-[reveal=off]:opacity-0",
  grow: "origin-left in-data-[reveal=off]:scale-x-0",
  pop: "ease-[cubic-bezier(0.34,1.56,0.64,1)] in-data-[reveal=off]:scale-50 in-data-[reveal=off]:opacity-0",
  wipe: "[clip-path:inset(0)] duration-1000 ease-out-expo in-data-[reveal=off]:[clip-path:inset(0_100%_0_0)]",
} as const;

type PopProps = ComponentPropsWithoutRef<"div"> & {
  from?: keyof typeof origins;
  /** Seconds to wait after the frame is revealed, so siblings arrive one after the other. */
  delay?: number;
};

/**
 * Hidden while an ancestor says `data-reveal="off"` (the frame rail does), then eased in once it
 * says `on`. Without that attribute nothing hides it. Keep hover transforms on a child: the delay
 * here would apply to them too.
 */
export function Pop({ from = "rise", delay = 0, className, style, ...props }: PopProps) {
  return (
    <div
      className={cn(
        "transition-[opacity,translate,scale,clip-path] duration-700 ease-out",
        origins[from],
        className,
      )}
      style={{ transitionDelay: `${delay}s`, ...style }}
      {...props}
    />
  );
}
