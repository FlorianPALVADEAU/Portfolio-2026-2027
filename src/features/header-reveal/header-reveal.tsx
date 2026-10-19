"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Always shown near the top, where hiding the bar would only feel like a glitch. */
const TOP_ZONE = 80;
/** Ignores scroll jitter so a trackpad rest never flips the bar. */
const THRESHOLD = 6;

function useScrolledDown() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      if (current < TOP_ZONE) setHidden(false);
      else if (current - last > THRESHOLD) setHidden(true);
      else if (last - current > THRESHOLD) setHidden(false);
      if (Math.abs(current - last) > THRESHOLD) last = current;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

type HeaderRevealProps = {
  children: ReactNode;
};

/**
 * A sticky header that slides away while reading down and returns on the first upward scroll.
 * Keyboard focus or an open menu inside it keeps it visible so nothing lands off screen.
 */
export function HeaderReveal({ children }: HeaderRevealProps) {
  const hidden = useScrolledDown();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 pt-3 transition-transform duration-(--duration-base) ease-out motion-reduce:transition-none",
        "focus-within:translate-y-0 has-aria-expanded:translate-y-0",
        hidden && "-translate-y-[calc(100%+0.75rem)]",
      )}
    >
      {children}
    </header>
  );
}
