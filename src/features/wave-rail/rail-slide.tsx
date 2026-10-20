import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type RailSlideProps = {
  /** Oversized outline word behind the slide, cut at its edges; decorative, so hidden from assistive technology. */
  ghost?: string;
  /** Pinned to the top-left of the slide while the rail runs. */
  heading?: ReactNode;
  /**
   * Any CSS colour. Makes the slide a chapter: it tints its background, its ghost word and the
   * stretch of wave that crosses it, and fills one segment of the chapter bar.
   */
  tone?: string;
  className?: string;
  children?: ReactNode;
};

/** One stretch of the rail: a block in a vertical stack at first, a full-height column once pinned. */
export function RailSlide({ ghost, heading, tone, className, children }: RailSlideProps) {
  return (
    <div
      data-rail-slide
      data-rail-chapter={tone ? "" : undefined}
      style={tone ? ({ "--rail-tone": tone } as CSSProperties) : undefined}
      className={cn(
        "relative flex flex-col gap-8 in-data-[motion=rail]:h-full in-data-[motion=rail]:shrink-0 in-data-[motion=rail]:flex-row in-data-[motion=rail]:items-center in-data-[motion=rail]:gap-0",
        className,
      )}
    >
      {tone && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-[color-mix(in_oklch,var(--rail-tone)_20%,transparent)] mask-[linear-gradient(to_right,transparent,black_16%,black_84%,transparent)] in-data-[motion=rail]:block"
        />
      )}
      {ghost && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden items-center overflow-hidden in-data-[motion=rail]:flex"
        >
          <span
            data-rail-parallax="0.18"
            className="text-[clamp(9rem,26vw,24rem)] leading-none font-semibold tracking-tighter whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_color-mix(in_oklch,var(--rail-tone,var(--border))_55%,transparent)]"
          >
            {ghost}
          </span>
        </span>
      )}
      {heading && (
        <div className="flex flex-col gap-2 in-data-[motion=rail]:absolute in-data-[motion=rail]:top-20 in-data-[motion=rail]:left-(--gutter) in-data-[motion=rail]:z-10">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}
