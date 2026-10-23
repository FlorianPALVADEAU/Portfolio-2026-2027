/** Moves `current` toward `target`, framerate independent: `lambda` is how fast, per second. */
export function damp(current: number, target: number, lambda: number, seconds: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * seconds));
}

export type Spring = { value: number; velocity: number };

/** One step of a damped spring pulling `spring` toward `rest`. */
export function springStep(
  spring: Spring,
  rest: number,
  stiffness: number,
  damping: number,
  seconds: number,
): Spring {
  const velocity =
    spring.velocity + (-stiffness * (spring.value - rest) - damping * spring.velocity) * seconds;
  return { value: spring.value + velocity * seconds, velocity };
}

/** Pointer position, from -1 (left, top) to 1 (right, bottom) across the screen. */
export type Gaze = { x: number; y: number };

/** Where the duck looks when nobody is moving a pointer: a slow wander, so it never freezes. */
export function wanderGaze(seconds: number): Gaze {
  return { x: Math.sin(seconds * 0.55) * 0.7, y: Math.sin(seconds * 0.37 + 1) * 0.35 };
}
