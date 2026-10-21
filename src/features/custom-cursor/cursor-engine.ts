import { gsap } from "gsap";
import {
  resolveCursorTarget,
  type Spring,
  stepSpring,
  streakLength,
  streakStrength,
  swingAngle,
} from "@/lib/cursor";
import {
  activeScrollHint,
  hasFinePointer,
  onReducedMotionChange,
  prefersReducedMotion,
} from "@/lib/motion";

const ACTIVE_CLASS = "cursor-custom";
/** Per second: how quickly the measured speed follows the pointer, so a pause calms the air. */
const SPEED_SMOOTHING = 14;
/** Each streak catches up at its own pace, so they stretch and fall back one after the other. */
const STREAK_LAGS = [26, 17, 11] as const;
const STREAK_SIZES = [1, 0.72, 0.5] as const;
/** The hand is a solid object: it leans less than the arrow does. */
const HAND_SWING = 0.5;

type Parts = {
  /** Fixed, zero-sized element moved to the pointer; carries `data-shape`, `data-label`, `data-pressed`. */
  root: HTMLElement;
  /** Turns around the tip, which is the root's origin. */
  swing: HTMLElement;
  streaks: readonly SVGLineElement[];
  /** Turns to the way the pointer goes; its streaks run back from the origin, so they trail behind. */
  streakGroup: SVGGElement;
};

type Point = { x: number; y: number };

/**
 * Runs the custom cursor: sits on the pointer, picks a shape and a tag for what is under it, and
 * lets the air play with it: the shape leans on a spring against the pointer's speed and a few
 * thin streaks stretch out behind it when it is flicked. Returns the cleanup. Does nothing without
 * a fine pointer.
 *
 * To debug, read `data-shape` and `data-label` on the root: they always hold what is shown.
 */
export function startCursor({ root, swing, streaks, streakGroup }: Parts): () => void {
  if (!hasFinePointer()) return () => {};

  let reduced = prefersReducedMotion();
  const stopWatchingMotion = onReducedMotionChange((value) => {
    reduced = value;
  });

  const pointer: Point = { x: 0, y: 0 };
  const last: Point = { x: 0, y: 0 };
  const velocity: Point = { x: 0, y: 0 };
  let lean: Spring = { value: 0, velocity: 0 };
  const streakSpeed = STREAK_LAGS.map(() => 0);
  let shape: string = "native";
  let inWindow = false;
  let scrollHint = false;
  let lastTarget: Element | null = null;

  const render = (next: ReturnType<typeof resolveCursorTarget>) => {
    shape = next.shape;
    const visible = inWindow && next.shape !== "native";
    root.dataset.shape = visible ? next.shape : "hidden";
    root.dataset.label = visible ? (next.label ?? "none") : "none";
    // The system pointer comes back wherever ours steps aside, so it is never lost.
    document.documentElement.classList.toggle(ACTIVE_CLASS, visible);
  };
  const refresh = (target: Element | null) => render(resolveCursorTarget(target, scrollHint));

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    lastTarget = event.target as Element | null;
    if (!inWindow) {
      inWindow = true;
      last.x = pointer.x;
      last.y = pointer.y;
      velocity.x = 0;
      velocity.y = 0;
    }
    refresh(lastTarget);
  };
  const onLeave = () => {
    inWindow = false;
    refresh(null);
  };
  const onPress = (down: boolean) => () => {
    if (down) root.dataset.pressed = "";
    else delete root.dataset.pressed;
  };
  const onDown = onPress(true);
  const onUp = onPress(false);
  // The page can scroll under a still pointer, which changes what is under it without a move.
  const onScroll = () => {
    if (inWindow) refresh(document.elementFromPoint(pointer.x, pointer.y));
  };

  const watchScrollHint = () => {
    const hint = activeScrollHint() !== null;
    if (hint === scrollHint) return;
    scrollHint = hint;
    if (inWindow) refresh(lastTarget);
  };

  const measureSpeed = (seconds: number) => {
    const ease = 1 - Math.exp(-SPEED_SMOOTHING * seconds);
    velocity.x += ((pointer.x - last.x) / seconds - velocity.x) * ease;
    velocity.y += ((pointer.y - last.y) / seconds - velocity.y) * ease;
    last.x = pointer.x;
    last.y = pointer.y;
  };

  const playWithAir = (seconds: number) => {
    const grip = shape === "hand" ? HAND_SWING : 1;
    lean = stepSpring(lean, swingAngle(velocity.x) * grip, seconds);
    swing.style.transform = `rotate(${lean.value}deg)`;

    const speed = Math.hypot(velocity.x, velocity.y);
    const heading = (Math.atan2(velocity.y, velocity.x) * 180) / Math.PI;
    streakGroup.setAttribute("transform", `rotate(${heading})`);
    streaks.forEach((line, index) => {
      const lag = STREAK_LAGS[index] ?? 1;
      const size = STREAK_SIZES[index] ?? 1;
      const previous = streakSpeed[index] ?? 0;
      const next = previous + (speed - previous) * (1 - Math.exp(-lag * seconds));
      streakSpeed[index] = next;
      const strength = streakStrength(next);
      line.setAttribute("x2", String(-streakLength(strength) * size));
      line.style.opacity = String(strength * size);
    });
  };

  const tick = (_time: number, deltaMs: number) => {
    watchScrollHint();
    if (!inWindow) return;
    const seconds = Math.min(deltaMs, 50) / 1000;
    root.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    if (reduced || seconds === 0) return;
    measureSpeed(seconds);
    playWithAir(seconds);
  };

  gsap.set(root, { visibility: "visible" });
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
    stopWatchingMotion();
  };
}
