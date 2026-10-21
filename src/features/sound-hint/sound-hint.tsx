"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { whenIntroOpen } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";
import { getServerSoundEnabled, getSoundEnabled, subscribeSound } from "@/lib/sound";

/** Lets the opening finish its first beat, so the hint is the next thing seen rather than part of the noise. */
const SHOW_DELAY_MS = 700;
const VISIBLE_MS = 9000;
const RISE_PX = 10;
const BOB_PX = 4;

/** One hint per page load: a locale switch remounts the header and must not repeat it. */
let hinted = false;

function dismissOn(close: () => void): () => void {
  const timer = setTimeout(close, VISIBLE_MS);
  window.addEventListener("pointerdown", close, { once: true });
  window.addEventListener("keydown", close, { once: true });
  return () => {
    clearTimeout(timer);
    window.removeEventListener("pointerdown", close);
    window.removeEventListener("keydown", close);
  };
}

/**
 * Points at the sound button once the page opens, while sound is still off. Place it inside a
 * `relative` wrapper around the button: it hangs under it, centred, and never takes a click.
 */
export function SoundHint({ label }: { label: string }) {
  const enabled = useSyncExternalStore(subscribeSound, getSoundEnabled, getServerSoundEnabled);
  const [open, setOpen] = useState(false);
  const bubble = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  useEffect(() => {
    if (hinted) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = whenIntroOpen(() => {
      timer = setTimeout(() => {
        if (getSoundEnabled()) return;
        hinted = true;
        setOpen(true);
      }, SHOW_DELAY_MS);
    });
    return () => {
      cancel();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const element = bubble.current;
    if (!(open && element)) return;
    const reduced = prefersReducedMotion();
    closing.current = false;

    const close = () => {
      if (closing.current) return;
      closing.current = true;
      gsap.killTweensOf(element);
      if (reduced) setOpen(false);
      else
        gsap.to(element, {
          autoAlpha: 0,
          y: -RISE_PX,
          duration: 0.3,
          onComplete: () => setOpen(false),
        });
    };

    const stopDismiss = dismissOn(close);
    if (enabled) close();
    if (!reduced) {
      gsap
        .timeline()
        .fromTo(
          element,
          { autoAlpha: 0, y: RISE_PX },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" },
        )
        .to(element, { y: -BOB_PX, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }
    return () => {
      stopDismiss();
      gsap.killTweensOf(element);
    };
  }, [open, enabled]);

  if (!open) return null;

  return (
    <div
      aria-hidden="true"
      data-sound-hint=""
      className="pointer-events-none absolute inset-x-0 top-full z-10 mt-3 flex justify-center"
    >
      <div
        ref={bubble}
        className="relative flex items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-3.5 py-2 font-mono text-[0.7rem] text-background uppercase tracking-[0.18em] shadow-md"
      >
        <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-foreground" />
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="relative size-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" />
        </svg>
        <span className="relative">{label}</span>
      </div>
    </div>
  );
}
