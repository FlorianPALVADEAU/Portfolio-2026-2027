import type { Group, Mesh } from "three";
import { damp, type Gaze, poseFor, wanderGaze } from "./duck-motion";

const IDLE_AFTER_SECONDS = 2.5;
const QUACK_SECONDS = 0.7;
const BLINK_EVERY_SECONDS = 3.6;
const BLINK_SECONDS = 0.14;

export type Input = {
  /** Pointer position across the screen, from -1 to 1. */
  gaze: Gaze;
  /** Seconds on the clock when the pointer last moved. */
  movedAt: number;
  /** Seconds on the clock when the duck was last pressed, or -Infinity. */
  quackedAt: number;
};

/** What the animation carries from one frame to the next. */
export type Memory = { gaze: Gaze };

export const newMemory = (): Memory => ({ gaze: { x: 0, y: 0 } });

type Ref<T> = { current: T | null };

export type Parts = {
  root: Ref<Group>;
  head: Ref<Group>;
  jaw: Ref<Mesh>;
  leftWing: Ref<Mesh>;
  rightWing: Ref<Mesh>;
  leftEye: Ref<Mesh>;
  rightEye: Ref<Mesh>;
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
  memory.gaze = {
    x: damp(memory.gaze.x, target.x, 5, seconds),
    y: damp(memory.gaze.y, target.y, 5, seconds),
  };
  const pose = poseFor(memory.gaze);

  const quack = Math.max(0, 1 - (now - input.quackedAt) / QUACK_SECONDS);
  const hop = quack > 0 ? Math.sin((1 - quack) * Math.PI) * 0.3 : 0;
  const { root, head, jaw, leftWing, rightWing, leftEye, rightEye } = parts;

  if (root.current) {
    root.current.rotation.y = pose.bodyYaw;
    root.current.rotation.x = pose.bodyPitch;
    root.current.position.y = Math.sin(now * 1.6) * 0.03 + hop;
  }
  if (head.current) {
    head.current.rotation.y = pose.headYaw - pose.bodyYaw;
    head.current.rotation.x = pose.headPitch - pose.bodyPitch + Math.sin(now * 1.6 + 1) * 0.02;
  }
  if (jaw.current) jaw.current.rotation.x = quack * 0.5 * Math.abs(Math.sin(now * 28));

  const flap = quack * Math.sin(now * 30) * 0.5;
  if (leftWing.current) leftWing.current.rotation.z = 0.3 + flap;
  if (rightWing.current) rightWing.current.rotation.z = -0.3 - flap;

  const blink = now % BLINK_EVERY_SECONDS < BLINK_SECONDS ? 0.1 : 1;
  for (const eye of [leftEye.current, rightEye.current]) {
    if (eye) eye.scale.y = damp(eye.scale.y, blink, 40, seconds);
  }
}
