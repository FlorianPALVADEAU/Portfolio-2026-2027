import type { ReactNode } from "react";

/** The row of nodes of one slide; the leading space keeps the first dot clear of the slide edge. */
export function RailNodes({ children }: { children: ReactNode }) {
  return (
    <ul className="flex flex-col gap-6 in-data-[motion=rail]:flex-row in-data-[motion=rail]:items-center in-data-[motion=rail]:gap-0 in-data-[motion=rail]:pl-[calc(var(--rail-pitch)*0.7)]">
      {children}
    </ul>
  );
}
