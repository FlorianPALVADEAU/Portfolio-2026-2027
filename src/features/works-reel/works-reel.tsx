"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion, takeWorkReturn } from "@/lib/motion";
import { canRenderScene } from "@/lib/scene";
import { preloadFocusIfEnabled } from "@/lib/sound";
import { type ReelCover, restingState } from "./reel-cover";
import {
  appearOnScroll,
  depthMapFor,
  followHover,
  followPointer,
  openOnClick,
  returnToCard,
  revealTextOnEnter,
} from "./reel-motion";

gsap.registerPlugin(ScrollTrigger);

const ReelCanvas = dynamic(() => import("./reel-canvas"), { ssr: false });

/** The 3D code is a large download, so it starts once the list is this close to the screen. */
const CANVAS_LEAD = "100% 0px";

/** Wires the animations of one cover and returns the plane that replaces it, if it has a picture. */
function bindCover(
  cell: HTMLElement,
  item: HTMLElement,
  id: string,
  container: HTMLElement,
  restores: Array<() => void>,
  open: (path: string) => void,
): ReelCover | null {
  const frame = item.querySelector<HTMLElement>("[data-reel-frame]");
  const image = item.querySelector<HTMLImageElement>("[data-reel-image]");
  if (!(frame && image)) return null;

  const link = item.querySelector<HTMLAnchorElement>("[data-reel-title]");
  const state = restingState();
  appearOnScroll(state, cell, container);
  restores.push(followHover(item, state));
  const depthSrc = depthMapFor(image);
  if (depthSrc) restores.push(followPointer(item, frame, state));
  if (link) restores.push(openOnClick(link, state, open));
  return { id, path: link?.pathname ?? "", frame, image, depthSrc, state };
}

/**
 * Carries the visitor through the project list. Covers are drawn as planes in one canvas and bend
 * like the inside of a tube while the page moves, rows appear in pairs that straighten and grow,
 * titles roll in letter by letter and tags decode from noise.
 * Marked descendants: `data-reel-cell`, `data-reel-item`, `data-reel-frame`, `data-reel-image` (and optional `data-reel-depth`),
 * `data-reel-title`, `data-reel-tags`. Without WebGL or with reduced motion the DOM covers stay
 * and the list stays a plain list.
 */
export function WorksReel({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [covers, setCovers] = useState<ReelCover[]>([]);
  const veil = useRef<HTMLDivElement>(null);
  const returnedFrom = useRef<string | null | undefined>(undefined);
  const router = useRouter();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: CANVAS_LEAD },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container || prefersReducedMotion()) return;
    // Read once per mount: React's development remount must find the same answer, while a page
    // brought back from the router cache, whose refs survive, must ask again.
    if (returnedFrom.current === undefined) returnedFrom.current = takeWorkReturn();

    const open = (path: string) => router.push(path);
    const restores: Array<() => void> = [];
    const planes: ReelCover[] = [];
    const cells = gsap.utils.toArray<HTMLElement>("[data-reel-cell]", container);
    const drawable = canRenderScene();
    if (drawable) preloadFocusIfEnabled();
    const context = gsap.context(() => {
      cells.forEach((cell, index) => {
        const item = cell.querySelector<HTMLElement>("[data-reel-item]");
        if (!item) return;
        revealTextOnEnter(item, restores);
        if (!drawable) return;
        const cover = bindCover(cell, item, `cover-${index}`, container, restores, open);
        if (cover) planes.push(cover);
      });
    }, container);
    setCovers(planes);

    const comingBack = planes.find((cover) => cover.path === returnedFrom.current);
    if (comingBack && veil.current) {
      setNear(true);
      restores.push(returnToCard(comingBack, veil.current));
    }

    return () => {
      // After the development remount, which runs in the same task, has had its look.
      queueMicrotask(() => {
        returnedFrom.current = undefined;
      });
      setCovers([]);
      context.revert();
      for (const restore of restores) restore();
    };
  }, [router]);

  return (
    <div ref={root}>
      {children}
      <div ref={veil} hidden aria-hidden="true" className="fixed inset-0 z-30 bg-background" />
      {near && covers.length > 0 && root.current ? (
        <ReelCanvas covers={covers} container={root.current} />
      ) : null}
    </div>
  );
}
