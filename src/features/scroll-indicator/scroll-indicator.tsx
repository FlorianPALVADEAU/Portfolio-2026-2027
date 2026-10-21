"use client";

import { useEffect, useRef } from "react";

/** Share of the track the thumb never shrinks below, however long the page is. */
const MIN_THUMB = 0.08;

/**
 * A slim scroll indicator floating at the right edge, shorter than the screen, in place of the
 * browser's bar (hidden in the global styles). It is a gauge only: the page scrolls by wheel, touch,
 * keys and the menu, so it is hidden from assistive technology and ignores the pointer. It inverts
 * what is behind it, so it reads on both the black and the paper sections.
 */
export function ScrollIndicator() {
  const thumb = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thumbElement = thumb.current;
    const trackElement = track.current;
    if (!(thumbElement && trackElement)) return;

    let frame = 0;
    const draw = () => {
      frame = 0;
      const page = document.documentElement;
      const reachable = page.scrollHeight - window.innerHeight;
      if (reachable <= 0) {
        trackElement.style.opacity = "0";
        return;
      }
      trackElement.style.opacity = "";
      const size = Math.max(MIN_THUMB, window.innerHeight / page.scrollHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / reachable));
      thumbElement.style.height = `${size * 100}%`;
      thumbElement.style.transform = `translateY(${progress * (1 / size - 1) * 100}%)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Pinned sections add their height after the first paint.
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={track}
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 right-1.5 z-(--z-overlay) h-[50svh] w-1 -translate-y-1/2 rounded-full bg-white/25 mix-blend-difference transition-opacity duration-(--duration-base) md:right-3 md:h-[40svh]"
    >
      <span ref={thumb} className="block w-full rounded-full bg-white will-change-transform" />
    </div>
  );
}
