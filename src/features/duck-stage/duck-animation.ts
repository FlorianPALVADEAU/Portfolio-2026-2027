import type { Group, Mesh } from "three";
import { damp, type Gaze, poseFor, type Swing, swingStep, wanderGaze } from "./duck-motion";

const IDLE_AFTER_SECONDS = 2.5;
const QUACK_SECONDS = 0.7;
const BLINK_EVERY_SECONDS = 3.6;
const BLINK_SECONDS = 0.14;
const BELL_LIMIT = 0.7;

export type Input = {
  /** Pointer position across the screen, from -1 to 1. */
  gaze: Gaze;
  /** Seconds on the clock when the pointer last moved. */
  movedAt: number;
  /** Seconds on the clock when the duck was last pressed, or -Infinity. */
  quackedAt: number;
};

/** What the animation carries from one frame to the next. */
export type Memory = { gaze: Gaze; swingX: Swing; swingZ: Swing; lastYaw: number };

export const newMemory = (): Memory => ({
  gaze: { x: 0, y: 0 },
  swingX: { angle: 0, velocity: 0 },
  swingZ: { angle: 0, velocity: 0 },
  lastYaw: 0,
});

type Ref<T> = { current: T | null };

export type Parts = {
  root: Ref<Group>;
  head: Ref<Group>;
  jaw: Ref<Mesh>;
  leftWing: Ref<Mesh>;
  rightWing: Ref<Mesh>;
  leftEye: Ref<Group>;
  rightEye: Ref<Group>;
  leftPupil: Ref<Mesh>;
  rightPupil: Ref<Mesh>;
  bell: Ref<Group>;
};

const clampSwing = (angle: number) => Math.max(-BELL_LIMIT, Math.min(BELL_LIMIT, angle));

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
  const hop = quack > 0 ? Math.sin((1 - quack) * Math.PI) * 0.35 : 0;
  const breath = Math.sin(now * 1.6);

  const { root, head, jaw, leftWing, rightWing, leftEye, rightEye, leftPupil, rightPupil, bell } =
    parts;
  if (root.current) {
    root.current.rotation.y = pose.bodyYaw;
    root.current.rotation.x = pose.bodyPitch;
    root.current.position.y = breath * 0.03 + hop;
  }
  if (head.current) {
    head.current.rotation.y = pose.headYaw - pose.bodyYaw;
    head.current.rotation.x = pose.headPitch - pose.bodyPitch + Math.sin(now * 1.6 + 1) * 0.02;
  }
  if (jaw.current) jaw.current.rotation.x = quack * 0.55 * Math.abs(Math.sin(now * 28));

  const flap = quack * Math.sin(now * 30) * 0.5;
  if (leftWing.current) leftWing.current.rotation.z = 0.35 + flap;
  if (rightWing.current) rightWing.current.rotation.z = -0.35 - flap;

  for (const pupil of [leftPupil.current, rightPupil.current]) {
    pupil?.position.set(pose.eyeX * 0.045, pose.eyeY * 0.04, 0.085);
  }
  const blink = now % BLINK_EVERY_SECONDS < BLINK_SECONDS ? 0.1 : 1;
  for (const eye of [leftEye.current, rightEye.current]) {
    if (eye) eye.scale.y = damp(eye.scale.y, blink, 40, seconds);
  }

  // The bell is pushed by the body turning and by the quack, and settles like a pendulum.
  memory.swingZ.velocity +=
    ((pose.bodyYaw - memory.lastYaw) / Math.max(seconds, 0.001)) * 0.9 * seconds;
  memory.lastYaw = pose.bodyYaw;
  memory.swingX.velocity += quack * Math.sin(now * 25) * 0.6 * seconds * 30;
  memory.swingX = swingStep(memory.swingX, 0, 60, 3.2, seconds);
  memory.swingZ = swingStep(memory.swingZ, 0, 60, 3.2, seconds);
  if (bell.current) {
    bell.current.rotation.z = clampSwing(memory.swingZ.angle);
    bell.current.rotation.x = clampSwing(memory.swingX.angle);
  }
}
