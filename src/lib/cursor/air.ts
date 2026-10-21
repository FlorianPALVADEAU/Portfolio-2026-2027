export type Spring = { value: number; velocity: number };

const MAX_SWING_DEGREES = 24;
const SWING_PER_SPEED = 0.014;
const STREAK_FROM_SPEED = 380;
const STREAK_FULL_SPEED = 1700;
const MAX_STREAK_LENGTH = 54;

/** One step of a damped spring: light enough to overshoot a little, which reads as a flutter. */
export function stepSpring(
  spring: Spring,
  target: number,
  deltaSeconds: number,
  stiffness = 190,
  damping = 11,
): Spring {
  const velocity =
    spring.velocity +
    (stiffness * (target - spring.value) - damping * spring.velocity) * deltaSeconds;
  return { value: spring.value + velocity * deltaSeconds, velocity };
}

/** The angle the cursor leans to: the air pushes its tail against the way the pointer goes. */
export function swingAngle(horizontalSpeed: number): number {
  const angle = horizontalSpeed * SWING_PER_SPEED;
  return Math.max(-MAX_SWING_DEGREES, Math.min(MAX_SWING_DEGREES, angle));
}

/** 0 while the pointer drifts, rising to 1 as it is flicked across the page. */
export function streakStrength(speed: number): number {
  const range = STREAK_FULL_SPEED - STREAK_FROM_SPEED;
  return Math.max(0, Math.min(1, (speed - STREAK_FROM_SPEED) / range));
}

export function streakLength(strength: number): number {
  return strength * MAX_STREAK_LENGTH;
}
