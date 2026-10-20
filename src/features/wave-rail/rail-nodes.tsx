import type { ReactNode } from "react";

/**
 * The row of nodes of one slide. Leading space keeps the first label clear of the slide heading;
 * trailing space keeps the last label inside its slide.
 */
export function RailNodes({ children }: { children: ReactNode }) {
  return (
    <ul className="flex flex-col gap-6 in-data-[motion=rail]:flex-row in-data-[motion=rail]:items-center in-data-[motion=rail]:gap-0 in-data-[motion=rail]:pr-[calc(var(--rail-pitch)*1.2)] in-data-[motion=rail]:pl-[calc(var(--rail-pitch)*0.6)]">
      {children}
    </ul>
  );
}
