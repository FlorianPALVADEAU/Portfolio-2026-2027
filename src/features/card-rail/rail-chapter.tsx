import type { ReactNode } from "react";

type RailChapterProps = {
  /** Oversized outline figure behind the heading, such as `01`; decorative. */
  numeral: string;
  heading: ReactNode;
  /** The cards of the chapter, as `RailCards`. */
  children: ReactNode;
};

/**
 * A group of cards with its title. Stacked at first; once pinned, a title block followed by the
 * row of cards. Chapters, in order, are the segments of the bar at the bottom of the stage.
 */
export function RailChapter({ numeral, heading, children }: RailChapterProps) {
  return (
    <div
      data-rail-chapter
      className="flex flex-col gap-8 in-data-[motion=rail]:h-full in-data-[motion=rail]:shrink-0 in-data-[motion=rail]:flex-row in-data-[motion=rail]:items-center in-data-[motion=rail]:gap-10"
    >
      <div className="relative flex flex-col gap-2 in-data-[motion=rail]:h-full in-data-[motion=rail]:w-[min(70vw,30rem)] in-data-[motion=rail]:shrink-0 in-data-[motion=rail]:justify-end in-data-[motion=rail]:pr-6 in-data-[motion=rail]:pb-[18svh] in-data-[motion=rail]:pl-(--gutter)">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden items-center overflow-hidden in-data-[motion=rail]:flex"
        >
          <span
            data-rail-parallax="0.12"
            className="pl-(--gutter) text-[clamp(9rem,22vw,20rem)] leading-none font-semibold tracking-tighter text-transparent select-none [-webkit-text-stroke:1px_var(--border)]"
          >
            {numeral}
          </span>
        </span>
        <div className="relative flex flex-col gap-2">{heading}</div>
      </div>
      {children}
    </div>
  );
}
