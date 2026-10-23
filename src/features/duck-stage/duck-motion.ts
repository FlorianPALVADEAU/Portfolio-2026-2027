/** Moves `current` toward `target`, framerate independent: `lambda` is how fast, per second. */
export function damp(current: number, target: number, lambda: number, seconds: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * seconds));
}

/** Pointer position, from -1 (left, top) to 1 (right, bottom) across the screen. */
export type Gaze = { x: number; y: number };

export type Pose = {
  bodyYaw: number;
  bodyPitch: number;
  headYaw: number;
  headPitch: number;
  /** Where the pupils sit in the eye, from -1 to 1 on each axis. */
  eyeX: number;
  eyeY: number;
};

/** The head follows further than the body, and the eyes furthest, so the duck looks before it turns. */
export function poseFor(gaze: Gaze): Pose {
  return {
    bodyYaw: gaze.x * 0.4,
    bodyPitch: gaze.y * 0.12,
    headYaw: gaze.x * 0.5,
    headPitch: gaze.y * 0.25,
    eyeX: gaze.x,
    eyeY: -gaze.y,
  };
}

/** Where the duck looks when nobody is moving a pointer: a slow wander, so it never freezes. */
export function wanderGaze(seconds: number): Gaze {
  return { x: Math.sin(seconds * 0.55) * 0.7, y: Math.sin(seconds * 0.37 + 1) * 0.35 };
}
