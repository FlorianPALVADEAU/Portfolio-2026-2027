"use client";

import { gsap } from "gsap";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/atoms/icon";
import { activeScrollHint, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type ScrollHintProps = {
  label: string;
};

const INTERACTIVE = "a, button, input, textarea, select, summary, [role='button']";

/**
 * Tells the visitor to keep scrolling while a pinned block (see `markScrollHint`) is not over. With
 * a mouse the pointer turns into a round "scroll" label, except over what can be clicked; on a
 * touch screen a pill stays fixed at the bottom of the screen. Both are decoration: nothing is
 * announced, and without a marked block, as under reduced motion, nothing shows.
 */
export function ScrollHint({ label }: ScrollHintProps) {
  const bubble = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roundLabel = bubble.current;
    const fixedLabel = pill.current;
    if (!(roundLabel && fixedLabel) || prefersReducedMotion()) return;
    const fine = hasFinePointer();

    let active = false;
    let overInteractive = false;
    let inWindow = false;
    const render = () => {
      const lit = active && fine && inWindow && !overInteractive;
      gsap.to(roundLabel, { scale: lit ? 1 : 0, duration: 0.3, ease: "power3.out" });
      document.body.style.cursor = lit ? "none" : "";
      gsap.to(fixedLabel, { autoAlpha: active && !fine ? 1 : 0, duration: 0.4 });
    };
    const check = () => {
      const hint = activeScrollHint();
      fixedLabel.style.setProperty("--hint-bottom", hint?.bottom ?? "1rem");
      if ((hint !== null) === active) return;
      active = hint !== null;
      render();
    };

    const moveX = gsap.quickTo(roundLabel, "x", { duration: 0.3, ease: "power3.out" });
    const moveY = gsap.quickTo(roundLabel, "y", { duration: 0.3, ease: "power3.out" });
    const onMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      const over = (event.target as Element).closest(INTERACTIVE) !== null;
      if (!inWindow || over !== overInteractive) {
        inWindow = true;
        overInteractive = over;
        render();
      }
    };
    const onLeave = () => {
      inWindow = false;
      render();
    };

    gsap.set(roundLabel, { scale: 0 });
    gsap.set(fixedLabel, { autoAlpha: 0 });
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    // The blocks mark themselves as they mount, which can be after this effect first runs.
    const frame = requestAnimationFrame(check);
    gsap.ticker.add(check);

    return () => {
      cancelAnimationFrame(frame);
      gsap.ticker.remove(check);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.body.style.cursor = "";
      gsap.killTweensOf([roundLabel, fixedLabel]);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div
        ref={bubble}
        className="pointer-events-none fixed top-0 left-0 z-(--z-overlay) -mt-10 -ml-10 flex size-20 scale-0 flex-col items-center justify-center gap-0.5 rounded-full bg-accent font-mono text-[0.65rem] tracking-widest text-accent-foreground uppercase max-md:hidden pointer-coarse:hidden"
      >
        {label}
        <Icon icon={ArrowDown} size="sm" className="motion-safe:animate-bounce" />
      </div>
      <div
        ref={pill}
        style={{ bottom: "var(--hint-bottom, 1rem)" }}
        className="pointer-events-none fixed left-1/2 z-(--z-overlay) flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 font-mono text-xs tracking-widest uppercase backdrop-blur pointer-fine:hidden"
      >
        {label}
        <Icon icon={ArrowDown} size="sm" className="motion-safe:animate-bounce" />
      </div>
    </div>
  );
}
