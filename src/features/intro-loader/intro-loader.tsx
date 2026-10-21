"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { hasPlayedIntro, openIntro } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";
import { buildIntro } from "./build-intro";
import { LETTERS, LOGO_HEIGHT, LOGO_WIDTH, MARKS, MARKS_CENTER } from "./marks";

/** The logo spans this much of the smaller viewport side, in the 100-unit view box below. */
const LOGO_VIEW_WIDTH = 64;
const LOGO_SCALE = LOGO_VIEW_WIDTH / LOGO_WIDTH;
const VIEW_SIZE = 100;
/** Where the letters first touch the marks while the marks still sit alone at the centre. */
const LETTERS_RIGHT_EDGE = 76.66;
const MARKS_LEFT_EDGE = 84.5;
/** A slow font or image must not trap the visitor behind the loader. */
const GIVE_UP_MS = 4000;
const SEAM_OVERLAP_PX = 1;
const REDUCED_HOLD_MS = 600;
const REDUCED_FADE_SECONDS = 0.4;

const MARKS_SHIFT = MARKS_CENTER.x - LOGO_WIDTH / 2;
const CONTACT_TRAVEL = LETTERS_RIGHT_EDGE - (MARKS_LEFT_EDGE - MARKS_SHIFT);

function pageReady(): Promise<void> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
  const settled = Promise.all([document.fonts.ready, loaded]).then(() => undefined);
  const giveUp = new Promise<void>((resolve) => setTimeout(resolve, GIVE_UP_MS));
  return Promise.race([settled, giveUp]);
}

const hidden = { visibility: "hidden" } as const;

function Logo({ welcome }: { welcome: string }) {
  return (
    <>
      <svg
        aria-hidden="true"
        data-logo
        viewBox={`${-VIEW_SIZE / 2} ${-VIEW_SIZE / 2} ${VIEW_SIZE} ${VIEW_SIZE}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 size-full fill-foreground stroke-foreground"
        strokeWidth={1}
      >
        <g
          transform={`translate(${(-LOGO_WIDTH / 2) * LOGO_SCALE} ${(-LOGO_HEIGHT / 2) * LOGO_SCALE}) scale(${LOGO_SCALE})`}
        >
          <g data-letters>
            {LETTERS.map(({ id, d }) => (
              <path key={id} d={d} data-letter={id} style={hidden} />
            ))}
          </g>
          <g data-marks>
            <g data-spin>
              {MARKS.map(({ id, d }) => (
                <path key={id} d={d} data-mark={id} style={hidden} />
              ))}
            </g>
          </g>
        </g>
      </svg>
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <p className="relative top-[14vmin] overflow-hidden font-mono text-[clamp(0.7rem,2.4vmin,1rem)] text-foreground uppercase tracking-[0.35em]">
          <span data-welcome style={hidden} className="block">
            {welcome}
          </span>
        </p>
      </div>
    </>
  );
}

/**
 * Opens the first visit: the four logo marks fly in and spin, the letters knock into them, then the
 * screen parts in two. Each half carries its own copy of the logo so the seam cuts through it.
 */
export function IntroLoader({ label, welcome }: { label: string; welcome: string }) {
  const overlay = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const element = overlay.current;
    if (!element) return;
    if (hasPlayedIntro()) {
      setDone(true);
      return;
    }

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const finish = () => {
      html.style.overflow = previousOverflow;
      setDone(true);
    };

    if (prefersReducedMotion()) {
      let cancelled = false;
      gsap.set("[data-mark], [data-letter]", { visibility: "visible" });
      gsap.set("[data-welcome]", { yPercent: 0, visibility: "visible" });
      gsap.set("[data-marks]", { x: 0 });
      const hold = new Promise<void>((resolve) => setTimeout(resolve, REDUCED_HOLD_MS));
      void Promise.all([pageReady(), hold]).then(() => {
        if (cancelled) return;
        openIntro();
        gsap.to(element, { autoAlpha: 0, duration: REDUCED_FADE_SECONDS, onComplete: finish });
      });
      return () => {
        cancelled = true;
        gsap.killTweensOf(element);
        html.style.overflow = previousOverflow;
      };
    }

    const { width, height } = element.getBoundingClientRect();
    const viewScale = Math.min(width, height) / VIEW_SIZE;
    const halfExtent = Math.max(width, height) / viewScale / 2;
    const cleanup = buildIntro({
      root: element,
      offscreen: (halfExtent + LOGO_VIEW_WIDTH) / LOGO_SCALE,
      markShift: MARKS_SHIFT,
      contactTravel: CONTACT_TRAVEL,
      ready: pageReady(),
      onPageCue: openIntro,
      onDone: finish,
    });
    return () => {
      cleanup();
      html.style.overflow = previousOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div ref={overlay} data-intro-loader className="fixed inset-0 z-(--z-loader)">
      <noscript>
        <style>{"[data-intro-loader]{display:none}"}</style>
      </noscript>
      {/* Each half is a full-screen copy clipped to its side, overlapping by a pixel so no seam shows. */}
      <div
        data-panel="top"
        className="absolute inset-0 bg-background"
        style={{ clipPath: `inset(0 0 calc(50% - ${SEAM_OVERLAP_PX}px) 0)` }}
      >
        <Logo welcome={welcome} />
      </div>
      <div
        data-panel="bottom"
        className="absolute inset-0 bg-background"
        style={{ clipPath: `inset(calc(50% - ${SEAM_OVERLAP_PX}px) 0 0 0)` }}
      >
        <Logo welcome={welcome} />
      </div>
      <span role="status" className="sr-only">
        {label}
      </span>
    </div>
  );
}
