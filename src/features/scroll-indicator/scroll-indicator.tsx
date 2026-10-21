"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";
import { whenIntroOpen } from "@/lib/intro";

/** Share of the track the thumb never shrinks below, however long the page is. */
const MIN_THUMB = 0.08;

/**
 * A slim scroll bar floating at the right edge, shorter than the screen, in place of the browser's
 * bar (hidden in the global styles). The thumb can be dragged with a mouse or a finger, and a press
 * on the track brings the thumb to it; the bar widens when hovered and while it is held. It stays hidden until the intro opens. The page still scrolls by
 * wheel, touch and keys, so it stays out of the accessibility tree. It inverts what is behind it, so
 * it reads on both the black and the paper sections, and sits above everything, loader included.
 */
export function ScrollIndicator() {
  const thumb = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);
  /** Distance in px between the top of the thumb and the pointer that holds it. */
  const grab = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // The loader owns the screen until the intro opens.
  useEffect(() => whenIntroOpen(() => setReady(true)), []);

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

  function scrollToPointer(clientY: number) {
    const trackElement = track.current;
    const thumbElement = thumb.current;
    if (!(trackElement && thumbElement && grab.current !== null)) return;
    const box = trackElement.getBoundingClientRect();
    const free = box.height - thumbElement.offsetHeight;
    if (free <= 0) return;
    const ratio = Math.min(1, Math.max(0, (clientY - box.top - grab.current) / free));
    const reachable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * reachable, behavior: "instant" });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const thumbBox = thumb.current?.getBoundingClientRect();
    if (!(thumbBox && track.current)) return;
    event.preventDefault();
    track.current.setPointerCapture(event.pointerId);
    track.current.dataset.dragging = "";
    const onThumb = event.clientY >= thumbBox.top && event.clientY <= thumbBox.bottom;
    // A press beside the thumb brings its middle to the pointer.
    grab.current = onThumb ? event.clientY - thumbBox.top : thumbBox.height / 2;
    scrollToPointer(event.clientY);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    scrollToPointer(event.clientY);
  }

  function release() {
    grab.current = null;
    delete track.current?.dataset.dragging;
  }

  return (
    <div
      ref={track}
      aria-hidden="true"
      data-ready={ready ? "" : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      className="group/bar fixed top-1/2 right-0 z-(--z-scrollbar) flex h-[50svh] w-7 -translate-y-1/2 cursor-grab touch-none justify-end py-0 pr-1.5 pointer-events-none opacity-0 mix-blend-difference transition-opacity data-[ready]:pointer-events-auto data-[ready]:opacity-100 duration-(--duration-base) data-[dragging]:cursor-grabbing md:h-[40svh] md:pr-3"
    >
      <div className="relative h-full w-1 rounded-full bg-white/25 transition-[width] duration-(--duration-base) group-hover/bar:w-2.5 group-data-[dragging]/bar:w-2.5">
        <span ref={thumb} className="block w-full rounded-full bg-white will-change-transform" />
      </div>
    </div>
  );
}
