"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

/** Distance in px the pointer, or the page under it, must travel before the next photo appears. */
const SPAWN_DISTANCE = 130;
const TILT = 12;
/** Below 1 so that the text laid over a photo stays readable. */
const PEAK_OPACITY = 0.7;

type PhotoTrailProps = {
  photos: readonly string[];
};

/**
 * Photos that appear along the pointer path, and along the path the page takes under a resting
 * pointer while scrolling, grow in with a small bounce and fade out. The layer
 * fills its parent and listens to it, so the parent decides where the trail lives. It sits behind
 * the parent's content (`z-0`: give that content `z-10`). The photos are mounted, and so
 * downloaded, only with a fine pointer and without reduced motion; elsewhere it renders nothing.
 */
export function PhotoTrail({ photos }: PhotoTrailProps) {
  const layer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(photos.length > 0 && !prefersReducedMotion() && hasFinePointer());
  }, [photos.length]);

  useEffect(() => {
    const element = layer.current;
    const stage = element?.parentElement;
    if (!(active && element && stage)) return;

    const frames = Array.from(element.children) as HTMLElement[];
    let last: { x: number; y: number } | null = null;
    let pointer: { x: number; y: number } | null = null;
    let scrollY = window.scrollY;
    let scrolled = 0;
    let next = 0;
    let stack = 1;

    function spawn(x: number, y: number) {
      const frame = frames[next % frames.length];
      next += 1;
      if (!frame) return;
      gsap.killTweensOf(frame);
      gsap
        .timeline()
        .set(frame, {
          x: x - frame.offsetWidth / 2,
          y: y - frame.offsetHeight / 2,
          rotation: gsap.utils.random(-TILT, TILT),
          zIndex: stack++,
        })
        .fromTo(
          frame,
          { opacity: 0, scale: 0.5 },
          { opacity: PEAK_OPACITY, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        )
        .to(frame, { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.in" }, "+=0.35");
    }

    function place(clientX: number, clientY: number) {
      const box = stage?.getBoundingClientRect();
      if (!box) return;
      const x = clientX - box.left;
      const y = clientY - box.top;
      if (x < 0 || y < 0 || x > box.width || y > box.height) return;
      last = { x, y };
      spawn(x, y);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      const box = stage?.getBoundingClientRect();
      if (!box) return;
      if (
        last &&
        Math.hypot(pointer.x - box.left - last.x, pointer.y - box.top - last.y) < SPAWN_DISTANCE
      )
        return;
      place(pointer.x, pointer.y);
    }

    function onScroll() {
      scrolled += Math.abs(window.scrollY - scrollY);
      scrollY = window.scrollY;
      if (!pointer || scrolled < SPAWN_DISTANCE) return;
      scrolled = 0;
      place(pointer.x, pointer.y);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(frames);
    };
  }, [active]);

  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {active &&
        photos.map((src) => (
          <div
            key={src}
            className="absolute top-0 left-0 aspect-[4/5] w-44 overflow-hidden rounded-md opacity-0 shadow-xl"
          >
            <Image src={src} alt="" fill sizes="11rem" className="object-cover" />
          </div>
        ))}
    </div>
  );
}
