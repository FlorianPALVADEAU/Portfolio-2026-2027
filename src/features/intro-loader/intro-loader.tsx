"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";
import { hasPlayedIntro, openIntro } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/motion";
import { buildIntro } from "./build-intro";
import { MARK_SIZE, MARKS } from "./marks";

const HOLE_ID = "intro-loader-hole";
/** The marks span this share of the smaller viewport side, in the 100-unit view box below. */
const MARK_VIEW_SIZE = 26;
const MARK_SCALE = MARK_VIEW_SIZE / MARK_SIZE;
const VIEW_HALF = 50;
const MASK_EXTENT = 5000;
/** A slow font or image must not trap the visitor behind the loader. */
const GIVE_UP_MS = 4000;
const REDUCED_HOLD_MS = 600;
const REDUCED_FADE_SECONDS = 0.4;

function pageReady(): Promise<void> {
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true }),
        );
  const settled = Promise.all([document.fonts.ready, loaded]).then(() => undefined);
  const giveUp = new Promise<void>((resolve) => setTimeout(resolve, GIVE_UP_MS));
  return Promise.race([settled, giveUp]);
}

function Marks({ layer }: { layer: "fill" | "hole" }) {
  return (
    <g
      transform={`translate(${-(MARK_SIZE / 2) * MARK_SCALE} ${-(MARK_SIZE / 2) * MARK_SCALE}) scale(${MARK_SCALE})`}
    >
      <g data-spin>
        {MARKS.map(({ id, d }) => (
          <path
            key={id}
            d={d}
            data-layer={layer}
            data-mark={id}
            strokeWidth={1}
            style={{ visibility: "hidden" }}
            {...(layer === "fill"
              ? { className: "fill-foreground stroke-foreground" }
              : { fill: "black", stroke: "black" })}
          />
        ))}
      </g>
    </g>
  );
}

/**
 * Opens the first visit of a session: the four logo marks fly in, spin, then the page shows through
 * them. The SVG mask is what makes the opening take the shape of the logo.
 */
export function IntroLoader({ label }: { label: string }) {
  const overlay = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const element = overlay.current;
    const root = svg.current;
    if (!(element && root)) return;
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
      gsap.set("[data-layer='fill']", { visibility: "visible" });
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

    const { width, height } = root.getBoundingClientRect();
    const viewScale = Math.min(width, height) / (VIEW_HALF * 2);
    const halfExtent = Math.max(width, height) / viewScale / 2;
    const cleanup = buildIntro({
      root,
      offscreen: (halfExtent + MARK_VIEW_SIZE) / MARK_SCALE,
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
      <svg
        ref={svg}
        aria-hidden="true"
        viewBox={`${-VIEW_HALF} ${-VIEW_HALF} ${VIEW_HALF * 2} ${VIEW_HALF * 2}`}
        preserveAspectRatio="xMidYMid meet"
        className="size-full"
      >
        <defs>
          <mask
            id={HOLE_ID}
            maskUnits="userSpaceOnUse"
            x={-MASK_EXTENT}
            y={-MASK_EXTENT}
            width={MASK_EXTENT * 2}
            height={MASK_EXTENT * 2}
          >
            <rect
              x={-MASK_EXTENT}
              y={-MASK_EXTENT}
              width={MASK_EXTENT * 2}
              height={MASK_EXTENT * 2}
              fill="white"
            />
            <Marks layer="hole" />
          </mask>
        </defs>
        <rect
          x={-MASK_EXTENT}
          y={-MASK_EXTENT}
          width={MASK_EXTENT * 2}
          height={MASK_EXTENT * 2}
          className="fill-background"
          mask={`url(#${HOLE_ID})`}
        />
        <Marks layer="fill" />
      </svg>
      <span role="status" className="sr-only">
        {label}
      </span>
    </div>
  );
}
