import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * One screen of the rail. Pinned, it fills the viewport and centres its content; stacked, it is
 * an ordinary block. Give it `aria-labelledby` so each frame is a named region.
 */
export function Frame({ className, children, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      data-frame
      className="px-(--gutter) in-data-[motion=rail]:h-full in-data-[motion=rail]:w-screen in-data-[motion=rail]:shrink-0 in-data-[motion=rail]:pt-24 in-data-[motion=rail]:pb-14 md:in-data-[motion=rail]:pt-28 md:in-data-[motion=rail]:pb-16"
      {...props}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-(--container-max) flex-col in-data-[motion=rail]:h-full in-data-[motion=rail]:justify-center",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
