import type { ReactNode } from "react";

/**
 * One card of the rail. While pinned it turns away from the viewer the further it sits from the
 * middle of the screen and a scrim dims it; the card nearest to the middle gets `data-active`,
 * which its content can style itself by.
 */
export function RailCard({ children }: { children: ReactNode }) {
  return (
    <li
      data-rail-card
      className="relative rounded-2xl in-data-[motion=rail]:w-(--card-width) in-data-[motion=rail]:shrink-0"
    >
      {children}
      <span
        aria-hidden="true"
        data-rail-scrim
        className="pointer-events-none absolute inset-0 hidden rounded-[inherit] bg-background opacity-0 in-data-[motion=rail]:block"
      />
    </li>
  );
}
