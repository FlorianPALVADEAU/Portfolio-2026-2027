"use client";

import { type ComponentPropsWithoutRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Scroll distance in px after which the bar narrows, so it stays wide on arrival. */
const THRESHOLD = 24;

/**
 * Wraps the bar and narrows it once the page has been scrolled, from the tablet width up where the
 * full width is wasted; a phone bar is already as narrow as the screen.
 */
export function HeaderShrink({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const update = () => setShrunk(window.scrollY > THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      data-shrunk={shrunk}
      className={cn(
        "mx-auto w-full transition-[width] duration-(--duration-slow) ease-out-expo motion-reduce:transition-none md:data-[shrunk=true]:w-[70%]",
        className,
      )}
      {...props}
    />
  );
}
