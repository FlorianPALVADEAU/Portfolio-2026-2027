import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A stretch of the rail that is not a chapter: the opening or the closing screen. */
export function RailPanel({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 in-data-[motion=rail]:h-full in-data-[motion=rail]:shrink-0 in-data-[motion=rail]:justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
