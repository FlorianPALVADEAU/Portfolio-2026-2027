"use client";

import { gsap } from "gsap";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { PointerTag } from "@/components/atoms/pointer-tag";
import { activeScrollHint, hasFinePointer, prefersReducedMotion, trailPointer } from "@/lib/motion";

type ScrollHintProps = {
  label: string;
};

/** A narrower window is a phone or a small tablet, which gets the fixed label whatever its pointer. */
const BESIDE_POINTER_MIN_WIDTH = 768;
const INTERACTIVE = "a, button, input, textarea, select, summary, [role='button']";
const BOUNCE = "motion-safe:animate-bounce";

/**
 * Tells the visitor to keep scrolling while a pinned block (see `markScrollHint`) is not over. With
 * a mouse a "scroll" tag trails the pointer, except over what can be clicked, while the native
 * pointer stays; on a touch screen the same tag stays fixed at the bottom of the screen. Both are
 * decoration: nothing is announced, and without a marked block, as under reduced motion, nothing
 * shows.
 */
export function ScrollHint({ label }: ScrollHintProps) {
  const beside = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const besideTag = beside.current;
    const bottomTag = bottom.current;
    if (!(besideTag && bottomTag) || prefersReducedMotion()) return;
    const follower = trailPointer(besideTag);
    const besidePointer = () => hasFinePointer() && window.innerWidth >= BESIDE_POINTER_MIN_WIDTH;

    let active = false;
    let overInteractive = false;
    let inWindow = false;
    const render = () => {
      const fine = besidePointer();
      follower.show(active && fine && inWindow && !overInteractive);
      gsap.to(bottomTag, { autoAlpha: active && !fine ? 1 : 0, duration: 0.4 });
    };
    const check = () => {
      const hint = activeScrollHint();
      bottomTag.style.setProperty("--hint-bottom", hint?.bottom ?? "1rem");
      if ((hint !== null) === active) return;
      active = hint !== null;
      render();
    };

    const onMove = (event: PointerEvent) => {
      follower.move(event.clientX, event.clientY);
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

    gsap.set(bottomTag, { autoAlpha: 0 });
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
      follower.release();
      gsap.killTweensOf(bottomTag);
    };
  }, []);

  return (
    <>
      <PointerTag ref={beside} anchor="pointer" icon={ArrowDown} iconClassName={BOUNCE}>
        {label}
      </PointerTag>
      <PointerTag
        ref={bottom}
        anchor="bottom"
        icon={ArrowDown}
        iconClassName={BOUNCE}
        className="bottom-[var(--hint-bottom,1rem)]"
      >
        {label}
      </PointerTag>
    </>
  );
}
