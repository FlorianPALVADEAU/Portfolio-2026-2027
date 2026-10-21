"use client";

import { ArrowUp } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { scrollToTop } from "@/lib/motion";

type BackToTopProps = {
  label: string;
};

/** Round button for the inverse ground of the footer; the arrow climbs out as a copy climbs in. */
export function BackToTop({ label }: BackToTopProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => scrollToTop(0)}
      className="group relative flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-background/30 text-background outline-offset-4 hover:text-foreground focus-visible:text-foreground"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-background transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
      />
      <span aria-hidden="true" className="relative flex h-5 flex-col overflow-hidden">
        <Icon
          icon={ArrowUp}
          size="md"
          className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none"
        />
        <Icon
          icon={ArrowUp}
          size="md"
          className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none"
        />
      </span>
    </button>
  );
}
