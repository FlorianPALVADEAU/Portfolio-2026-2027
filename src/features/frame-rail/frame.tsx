import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type FrameProps = ComponentPropsWithoutRef<"section"> & {
  /** Oversized outline figure behind the content, such as `01`; decorative, pinned rail only. */
  numeral?: string;
};

/**
 * One screen of the rail. Pinned, it fills the viewport and centres its content; stacked, it is
 * an ordinary block. Give it `aria-labelledby` so each frame is a named region.
 */
export function Frame({ numeral, className, children, ...props }: FrameProps) {
  return (
    <section
      data-frame
      className="relative px-(--gutter) in-data-[motion=rail]:h-full in-data-[motion=rail]:w-screen in-data-[motion=rail]:shrink-0 in-data-[motion=rail]:pt-24 in-data-[motion=rail]:pb-14 md:in-data-[motion=rail]:pt-28 md:in-data-[motion=rail]:pb-16"
      {...props}
    >
      {numeral && (
        <span
          aria-hidden="true"
          data-frame-parallax="0.18"
          className="pointer-events-none absolute right-[4vw] bottom-[8vh] hidden md:in-data-[motion=rail]:block text-[clamp(10rem,30vw,28rem)] leading-none font-semibold tracking-tighter text-transparent select-none [-webkit-text-stroke:1px_var(--border)]"
        >
          {numeral}
        </span>
      )}
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-(--container-max) flex-col in-data-[motion=rail]:h-full in-data-[motion=rail]:justify-center",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
