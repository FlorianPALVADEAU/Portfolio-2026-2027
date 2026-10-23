import type { Group, Vector2 } from "three";
import { damp, type Gaze, type Spring, springStep, wanderGaze } from "./duck-motion";

const IDLE_AFTER_SECONDS = 2.5;
/** How far, in radians, the whole toy turns when the pointer is at the edge of the screen. */
const TURN = 0.5;
/** Tilt, in radians, at the bottom edge of the screen: the toy bows toward the visitor much further than it leans back. */
const LEAN_FORWARD = 0.4;
const LEAN_BACK = 0.14;
/** The toy stands leaning back a little when the pointer is in the middle, so it arrives rearing up. */
const REST_LEAN = -0.15;
/** The lean turns about the toy's feet, as if they were planted: height and depth in scene units. */
const PIVOT = { y: 0, z: 0.35 };
/** How much the head swings, per unit of gaze speed. */
const SWAY_PUSH = 0.05;
const MAX_SWAY = 9;
const PRESS_PUSH = 8;
const SQUEEZE_DAMPING = 7;
const RELEASE_DAMPING = 30;

export type Input = {
  /** Pointer position across the screen, from -1 to 1. */
  gaze: Gaze;
  /** Seconds on the clock when the pointer last moved. */
  movedAt: number;
  /** Seconds on the clock when the duck was last pressed, or -Infinity. */
  quackedAt: number;
};

/** What the animation carries from one frame to the next. */
export type Memory = {
  gaze: Gaze;
  sway: { x: Spring; y: Spring };
  squash: Spring;
  pressedAt: number;
};

export const newMemory = (): Memory => ({
  gaze: { x: 0, y: 0 },
  sway: { x: { value: 0, velocity: 0 }, y: { value: 0, velocity: 0 } },
  squash: { value: 0, velocity: 0 },
  pressedAt: Number.NEGATIVE_INFINITY,
});

type Ref<T> = { current: T | null };

export type Parts = {
  /** Turns and leans toward the pointer. */
  root: Ref<Group>;
  /** Squashes and stretches, and breathes. */
  body: Ref<Group>;
  /** Fed to the vertex shader, which swings the top of the toy. */
  sway: Vector2;
};

/** Steps the duck's whole pose by one frame. `now` and `seconds` are real time, in seconds. */
export function animateDuck(
  parts: Parts,
  input: Input,
  memory: Memory,
  now: number,
  seconds: number,
): void {
  const idle = now - input.movedAt > IDLE_AFTER_SECONDS;
  const target = idle ? wanderGaze(now) : input.gaze;
  const previous = memory.gaze;
  memory.gaze = {
    x: damp(previous.x, target.x, 5, seconds),
    y: damp(previous.y, target.y, 5, seconds),
  };
  const speed = {
    x: (memory.gaze.x - previous.x) / Math.max(seconds, 0.001),
    y: (memory.gaze.y - previous.y) / Math.max(seconds, 0.001),
  };

  // The head lags behind the turn, then swings back, like a stuffed neck.
  memory.sway.x.velocity -= speed.x * SWAY_PUSH * 60 * seconds;
  memory.sway.y.velocity -= speed.y * SWAY_PUSH * 60 * seconds;
  memory.sway.x = springStep(memory.sway.x, 0, 90, 5, seconds);
  memory.sway.y = springStep(memory.sway.y, 0, 90, 5, seconds);
  const clamp = (value: number) => Math.max(-MAX_SWAY, Math.min(MAX_SWAY, value));
  parts.sway.set(clamp(memory.sway.x.value * 6), clamp(memory.sway.y.value * 6));

  // A press squeezes the toy, which springs back taller than it was.
  if (input.quackedAt !== memory.pressedAt) {
    memory.pressedAt = input.quackedAt;
    memory.squash.velocity -= PRESS_PUSH;
  }
  // Damped harder once past rest, so the squeeze is deep and the spring back barely overshoots.
  const damping = memory.squash.value > 0 ? RELEASE_DAMPING : SQUEEZE_DAMPING;
  memory.squash = springStep(memory.squash, 0, 140, damping, seconds);

  const { root, body } = parts;
  if (root.current) {
    root.current.rotation.y = memory.gaze.x * TURN;
    const lean = REST_LEAN + memory.gaze.y * (memory.gaze.y > 0 ? LEAN_FORWARD : LEAN_BACK);
    const [sin, cos] = [Math.sin(lean), Math.cos(lean)];
    root.current.rotation.x = lean;
    // Keeps the pivot point where it was, so the rotation happens around it and not around the feet.
    root.current.position.y = PIVOT.y - (PIVOT.y * cos - PIVOT.z * sin);
    root.current.position.z = PIVOT.z - (PIVOT.y * sin + PIVOT.z * cos);
  }
  if (body.current) {
    const breath = 1 + Math.sin(now * 1.6) * 0.008;
    const stretch = memory.squash.value;
    body.current.scale.set(
      breath * (1 - stretch * 0.5),
      breath * (1 + stretch),
      breath * (1 - stretch * 0.5),
    );
  }
}
