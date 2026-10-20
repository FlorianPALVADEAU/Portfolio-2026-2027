import type { ReactNode } from "react";

/** The cards of one chapter: a grid at first, a single row once pinned. */
export function RailCards({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 in-data-[motion=rail]:flex in-data-[motion=rail]:items-center in-data-[motion=rail]:gap-(--card-gap)">
      {children}
    </ul>
  );
}
