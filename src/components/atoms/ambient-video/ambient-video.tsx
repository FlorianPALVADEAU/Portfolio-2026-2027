"use client";

import { useEffect, useRef } from "react";
import { onReducedMotionChange, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AmbientVideoProps = {
  src: string;
  poster: string;
  className?: string;
};

/**
 * A decorative muted loop that plays only while it is on screen, and never under reduced motion,
 * where its poster stays. It is hidden from assistive technology: it adds mood, not information.
 */
export function AmbientVideo({ src, poster, className }: AmbientVideoProps) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    let visible = false;
    const sync = () => {
      if (visible && !prefersReducedMotion()) element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    observer.observe(element);
    const stopListening = onReducedMotionChange(sync);

    return () => {
      observer.disconnect();
      stopListening();
    };
  }, []);

  return (
    <video
      ref={video}
      src={src}
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="metadata"
      className={cn("size-full object-cover", className)}
    />
  );
}
