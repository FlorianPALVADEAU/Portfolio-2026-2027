"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react";
import type { GalleryItem } from "@/lib/landing";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { playIfEnabled } from "@/lib/sound";
import { ZoomMedia } from "./zoom-media";
import { hasPassed, pose, smoothstep, wordReveal } from "./zoom-pose";

gsap.registerPlugin(ScrollTrigger);

/** Viewport heights the section lasts: three for the dive, one more holding the closing text. */
const TRACK = "500svh";
/** Share of the scroll the dive itself takes, so the hold after it does not slow the photos. */
const SCENE_END = 300 / 400;
/** Share of the remaining distance the scroll and the pointer cover per frame at 60 fps. */
const EASING = 0.1;
/** Below this stage width the photos are enlarged, so they stay legible on a phone. */
const SMALL_STAGE = 768;
const SMALL_STAGE_ZOOM = 1.7;
/** Scroll progress over which the title leaves, and over which the closing text arrives. */
const INTRO_END = 0.16;
const OUTRO = [0.8, 0.99] as const;
/** Share of the hold, after the closing text is complete, over which the black turns to paper. */
const PAPER = [0.1, 0.65] as const;
/** Shortest gap in ms between two whooshes, so a fast scroll is a gust and not a rattle. */
const WHOOSH_GAP_MS = 140;
/** How far a photo at the side of the frame pulls its whoosh towards that ear. */
const WHOOSH_PAN = 0.8;
/** Resting sway of a touch screen, which has no pointer to follow. */
const SWAY = { x: 0.5, y: 0.35, period: 8 } as const;

type ZoomGalleryProps = {
  items: readonly GalleryItem[];
  /** Alternative text by item id. */
  alts: Readonly<Record<string, string>>;
  /** Centred title, shown first and dissolved as the visitor starts to scroll. */
  intro: ReactNode;
  /** Centred text that fades in once the photos have all passed. */
  outro: ReactNode;
};

/** Inline styles the live mode sets; the static layout must not inherit any of them. */
const LIVE_STYLES = ["width", "opacity", "visibility", "transform", "filter"] as const;

type Pose = ReturnType<typeof pose>;

function paint(figure: HTMLElement, next: Pose) {
  figure.style.opacity = String(next.opacity);
  figure.style.visibility = next.opacity < 0.01 ? "hidden" : "visible";
  figure.style.transform = `translate3d(${next.x}px, ${next.y}px, 0) translate(-50%, -50%) scale(${next.scale})`;
  figure.style.filter = `blur(${next.blur}px) brightness(${next.brightness})`;
  const video = figure.querySelector("video");
  if (!video) return;
  if (next.opacity > 0.05 && video.paused) video.play().catch(() => {});
  else if (next.opacity <= 0.05 && !video.paused) video.pause();
}

/**
 * A scene of photos and videos that the visitor flies into by scrolling. The section is held on
 * screen for a few viewport heights; the scroll moves the viewer forward, so the photos at the
 * back grow, drift out past the frame and blur as they go, others come out of the distance, and
 * the closing text fades in last. The scroll that follows turns the black background to paper (the
 * light colours of a dark page, the page's own otherwise), so the section below carries on from
 * it; scrolling back turns it black again. The pointer, or a slow sway on touch screens, shifts
 * near photos more than far ones. Videos play only while they are visible.
 *
 * Without JavaScript, or under reduced motion, the section is a plain grid between the two texts.
 */
export function ZoomGallery({ items, alts, intro, outro }: ZoomGalleryProps) {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = track.current;
    const stage = root?.firstElementChild;
    if (!(root && stage instanceof HTMLElement) || prefersReducedMotion()) return;

    const paperStyle = root.style;
    const figures = Array.from(stage.querySelectorAll<HTMLElement>("[data-zoom-item]"));
    const introElement = stage.querySelector<HTMLElement>("[data-zoom-intro]");
    const words = Array.from(stage.querySelectorAll<HTMLElement>("[data-zoom-word]"));
    const fine = hasFinePointer();
    const half = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };
    const lookTarget = { x: 0, y: 0 };
    let raw = 0;
    let progress = 0;
    let visible = true;
    let dirty = true;
    const passed = items.map((item) => hasPassed(item, 0));
    let lastWhoosh = 0;

    root.dataset.mode = "live";

    function follow(scroll: number) {
      raw = Math.min(1, scroll / SCENE_END);
      const held = Math.max(0, (scroll - SCENE_END) / (1 - SCENE_END));
      const mix = smoothstep(PAPER[0], PAPER[1], held);
      paperStyle.setProperty("--paper", `${(mix * 100).toFixed(1)}%`);
    }

    function measure() {
      const { width, height } = (stage as HTMLElement).getBoundingClientRect();
      half.x = width / 2;
      half.y = height / 2;
      const unit = width < SMALL_STAGE ? width * SMALL_STAGE_ZOOM : width;
      figures.forEach((figure, index) => {
        const item = items[index];
        if (item) figure.style.width = `${unit * item.width}px`;
      });
      dirty = true;
    }

    function whoosh(pan: number) {
      const now = performance.now();
      if (now - lastWhoosh < WHOOSH_GAP_MS) return;
      lastWhoosh = now;
      playIfEnabled("whoosh", pan);
    }

    function draw() {
      figures.forEach((figure, index) => {
        const item = items[index];
        if (!item) return;
        paint(figure, pose(item, progress, half, look));
        const past = hasPassed(item, progress);
        if (past !== passed[index] && visible) {
          whoosh(Math.max(-1, Math.min(1, item.ox)) * WHOOSH_PAN);
        }
        passed[index] = past;
      });
      if (introElement) {
        const gone = smoothstep(0, INTRO_END, progress);
        introElement.style.opacity = String(1 - gone);
        introElement.style.transform = `scale(${1 + gone * 0.6})`;
        introElement.style.filter = `blur(${gone * 10}px)`;
      }
      const arrived = smoothstep(OUTRO[0], OUTRO[1], progress);
      words.forEach((word, index) => {
        const shown = wordReveal(index, words.length, arrived);
        word.style.opacity = String(shown);
        word.style.transform = `translateY(${(1 - shown) * 110}%)`;
        word.style.filter = `blur(${(1 - shown) * 6}px)`;
      });
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const box = (stage as HTMLElement).getBoundingClientRect();
      lookTarget.x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      lookTarget.y = ((event.clientY - box.top) / box.height - 0.5) * 2;
    }

    function onLeave() {
      lookTarget.x = 0;
      lookTarget.y = 0;
    }

    function tick(time: number) {
      if (!visible) return;
      if (!fine) {
        const angle = (time / SWAY.period) * Math.PI * 2;
        lookTarget.x = Math.sin(angle) * SWAY.x;
        lookTarget.y = Math.cos(angle * 0.7) * SWAY.y;
      }
      const amount = 1 - (1 - EASING) ** (gsap.ticker.deltaRatio(60) || 1);
      const moved =
        Math.abs(raw - progress) > 1e-4 ||
        Math.abs(lookTarget.x - look.x) > 1e-3 ||
        Math.abs(lookTarget.y - look.y) > 1e-3;
      if (!(moved || dirty)) return;
      progress += (raw - progress) * amount;
      look.x += (lookTarget.x - look.x) * amount;
      look.y += (lookTarget.y - look.y) * amount;
      dirty = false;
      draw();
    }

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => follow(self.progress),
    });
    follow(trigger.progress);
    progress = raw;
    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    observer.observe(root);
    measure();
    draw();
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      resize.disconnect();
      trigger.kill();
      for (const element of [...figures, ...words, introElement]) {
        if (element) for (const name of LIVE_STYLES) element.style.removeProperty(name);
      }
      root.style.removeProperty("--paper");
      root.dataset.mode = "static";
    };
  }, [items]);

  return (
    <div
      ref={track}
      data-mode="static"
      data-theme="dark"
      style={{ "--track": TRACK, "--paper": "0%" } as CSSProperties}
      className="group/zoom bg-[color-mix(in_srgb,var(--paper-background)_var(--paper),#000)] text-[color-mix(in_srgb,var(--paper-foreground)_var(--paper),var(--foreground))] data-[mode=live]:h-(--track)"
    >
      <div className="flex flex-col gap-10 px-(--gutter) py-(--section-space) group-data-[mode=live]/zoom:sticky group-data-[mode=live]/zoom:top-0 group-data-[mode=live]/zoom:block group-data-[mode=live]/zoom:h-svh group-data-[mode=live]/zoom:overflow-clip group-data-[mode=live]/zoom:p-0">
        <div
          data-zoom-intro
          className="order-1 group-data-[mode=live]/zoom:absolute group-data-[mode=live]/zoom:inset-0 group-data-[mode=live]/zoom:z-10 group-data-[mode=live]/zoom:grid group-data-[mode=live]/zoom:place-items-center"
        >
          {intro}
        </div>
        <div className="order-2 grid grid-cols-2 gap-3 group-data-[mode=live]/zoom:contents md:grid-cols-4">
          {items.map((item) => (
            <figure
              key={item.id}
              data-zoom-item
              style={{ aspectRatio: item.ratio }}
              className="relative m-0 overflow-hidden rounded-md group-data-[mode=live]/zoom:absolute group-data-[mode=live]/zoom:top-1/2 group-data-[mode=live]/zoom:left-1/2 group-data-[mode=live]/zoom:will-change-transform"
            >
              <ZoomMedia item={item} alt={alts[item.id] ?? ""} />
            </figure>
          ))}
        </div>
        <div
          data-zoom-outro
          className="order-3 group-data-[mode=live]/zoom:absolute group-data-[mode=live]/zoom:inset-0 group-data-[mode=live]/zoom:z-10 group-data-[mode=live]/zoom:grid group-data-[mode=live]/zoom:place-items-center"
        >
          {outro}
        </div>
      </div>
    </div>
  );
}
