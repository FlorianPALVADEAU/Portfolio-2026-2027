"use client";

import { gsap } from "gsap";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/atoms/icon";
import { activeScrollHint, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type ScrollHintProps = {
  label: string;
};

/**
 * Tells a touch visitor to keep scrolling while a pinned block (see `markScrollHint`) is not over,
 * with a pill fixed at the bottom of the screen. With a mouse the custom cursor carries the same
 * hint instead. Decoration only: nothing is announced, and without a marked block, as under
 * reduced motion, nothing shows.
 */
export function ScrollHint({ label }: ScrollHintProps) {
  const pill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = pill.current;
    if (!element || prefersReducedMotion() || hasFinePointer()) return;

    let active = false;
    const check = () => {
      const hint = activeScrollHint();
      element.style.setProperty("--hint-bottom", hint?.bottom ?? "1rem");
      if ((hint !== null) === active) return;
      active = hint !== null;
      gsap.to(element, { autoAlpha: active ? 1 : 0, duration: 0.4 });
    };

    gsap.set(element, { autoAlpha: 0 });
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    // The blocks mark themselves as they mount, which can be after this effect first runs.
    const frame = requestAnimationFrame(check);
    gsap.ticker.add(check);

    return () => {
      cancelAnimationFrame(frame);
      gsap.ticker.remove(check);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <div
      ref={pill}
      aria-hidden="true"
      style={{ bottom: "var(--hint-bottom, 1rem)" }}
      className="pointer-events-none invisible fixed left-1/2 z-(--z-overlay) flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-xs tracking-widest uppercase backdrop-blur"
    >
      {label}
      <Icon icon={ArrowDown} size="sm" className="motion-safe:animate-bounce" />
    </div>
  );
}
