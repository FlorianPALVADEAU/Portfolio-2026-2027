import { gsap } from "gsap";
import { type CursorKind, resolveCursorTarget } from "@/lib/cursor";
import {
  activeScrollHint,
  hasFinePointer,
  onReducedMotionChange,
  prefersReducedMotion,
} from "@/lib/motion";
import { LABELLED, LOOKS } from "./cursor-looks";
import { createTrailCanvas } from "./trail-canvas";

const ACTIVE_CLASS = "cursor-custom";
/** Higher is snappier: how quickly the dot closes the gap to the real pointer. */
const FOLLOW_STIFFNESS = 22;
const LINK_PULL = 0.28;
const PRESS_SCALE = 0.82;

type Parts = {
  /** Fixed, zero-sized element that is moved to the pointer. */
  root: HTMLElement;
  /** The shape that morphs; holds the fill layer and the labels. */
  body: HTMLElement;
  fill: HTMLElement;
  canvas: HTMLCanvasElement;
};

type Point = { x: number; y: number };

/**
 * Runs the custom cursor: follows the pointer, picks a look for what is under it, morphs between
 * looks and draws the trail. Returns the cleanup. Does nothing without a fine pointer.
 *
 * To debug, inspect `data-cursor-kind` on the root: it always holds the look being shown.
 */
export function startCursor({ root, body, fill, canvas }: Parts): () => void {
  if (!hasFinePointer()) return () => {};

  const labels = body.querySelectorAll<HTMLElement>("[data-cursor-label]");
  const trail = createTrailCanvas(canvas);
  let reduced = prefersReducedMotion();
  const stopWatchingMotion = onReducedMotionChange((value) => {
    reduced = value;
    if (value) trail.reset();
  });

  const pointer: Point = { x: 0, y: 0 };
  const shown: Point = { x: 0, y: 0 };
  let kind: CursorKind = "native";
  let anchor: Element | null = null;
  let inWindow = false;
  let pressed = false;

  const duration = (seconds: number) => (reduced ? 0 : seconds);

  const bodyScale = (visible: boolean) => {
    if (!visible) return 0;
    return pressed ? PRESS_SCALE : 1;
  };

  const renderLook = () => {
    const look = LOOKS[kind];
    const visible = look.visible && inWindow;
    gsap.to(body, {
      width: look.width,
      height: look.height,
      scale: bodyScale(visible),
      duration: duration(0.55),
      ease: "expo.out",
      overwrite: "auto",
    });
    gsap.to(fill, { opacity: look.filled ? 1 : 0, duration: duration(0.3), overwrite: "auto" });
    for (const label of labels) {
      const lit = label.dataset.cursorLabel === kind && LABELLED.includes(kind);
      gsap.to(label, { opacity: lit ? 1 : 0, duration: duration(0.25), overwrite: "auto" });
    }
    root.dataset.cursorKind = visible ? kind : "hidden";
    // The system pointer comes back wherever ours steps aside, so it is never lost.
    document.documentElement.classList.toggle(ACTIVE_CLASS, visible);
  };

  let scrollHint = false;
  const setKind = (target: Element | null, force = false) => {
    const next = resolveCursorTarget(target, scrollHint);
    if (!force && next.kind === kind && next.anchor === anchor) return;
    kind = next.kind;
    anchor = next.anchor;
    renderLook();
  };

  let lastTarget: Element | null = null;
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    lastTarget = event.target as Element | null;
    const entering = !inWindow;
    if (entering) {
      inWindow = true;
      shown.x = pointer.x;
      shown.y = pointer.y;
      trail.reset();
    }
    setKind(lastTarget, entering);
  };
  const onLeave = () => {
    inWindow = false;
    renderLook();
  };
  const onPress = (down: boolean) => () => {
    pressed = down;
    renderLook();
  };
  const onDown = onPress(true);
  const onUp = onPress(false);
  // The page can scroll under a still pointer, which changes what is under it without a move.
  const onScroll = () => {
    if (inWindow) setKind(document.elementFromPoint(pointer.x, pointer.y));
  };

  const goal = (): Point => {
    if (kind !== "link" || !anchor) return pointer;
    const rect = anchor.getBoundingClientRect();
    return {
      x: pointer.x + (rect.left + rect.width / 2 - pointer.x) * LINK_PULL,
      y: pointer.y + (rect.top + rect.height / 2 - pointer.y) * LINK_PULL,
    };
  };

  const watchScrollHint = () => {
    const hint = activeScrollHint() !== null;
    if (hint === scrollHint) return;
    scrollHint = hint;
    if (inWindow) setKind(lastTarget);
  };

  const tick = (_time: number, deltaMs: number) => {
    watchScrollHint();
    if (!inWindow) {
      trail.reset();
      return;
    }

    const target = goal();
    const follow = reduced ? 1 : 1 - Math.exp((-FOLLOW_STIFFNESS * deltaMs) / 1000);
    shown.x += (target.x - shown.x) * follow;
    shown.y += (target.y - shown.y) * follow;
    root.style.transform = `translate3d(${shown.x}px, ${shown.y}px, 0)`;

    if (reduced) return;
    if (kind === "native") trail.reset();
    else trail.follow(shown.x, shown.y);
  };

  gsap.set(root, { visibility: "visible" });
  gsap.set(body, { xPercent: -50, yPercent: -50, scale: 0 });
  gsap.set(labels, { opacity: 0 });
  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerdown", onDown);
  document.addEventListener("pointerup", onUp);
  document.addEventListener("scroll", onScroll, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerup", onUp);
    document.removeEventListener("scroll", onScroll);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.documentElement.classList.remove(ACTIVE_CLASS);
    root.style.visibility = "";
    gsap.killTweensOf([body, fill, ...labels]);
    stopWatchingMotion();
    trail.destroy();
  };
}
