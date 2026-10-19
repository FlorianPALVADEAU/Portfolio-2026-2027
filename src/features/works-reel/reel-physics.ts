/** Scroll speed, in px/s, at which the warp reaches about three quarters of its maximum. */
const REFERENCE_VELOCITY = 1800;
/** Seconds to catch up with a faster target: quick enough to feel attached to the scroll. */
const RISE = 0.1;
/** Seconds to let go of a slower target: the rows resist losing speed, back to rest in ~0.6s. */
const FALL = 0.18;

/** Warp strength from 0 to 1 for any scroll speed. Direction does not matter, only speed. */
export function pinchTarget(velocity: number): number {
  return Math.tanh(Math.abs(velocity) / REFERENCE_VELOCITY);
}

/**
 * Moves `current` toward `target` independently of the frame rate, with no overshoot. It lands
 * exactly on zero once a resting target is close enough, so no tilt is left behind.
 */
export function followTarget(current: number, target: number, deltaSeconds: number): number {
  const time = Math.abs(target) > Math.abs(current) ? RISE : FALL;
  const next = current + (target - current) * (1 - Math.exp(-deltaSeconds / time));
  return target === 0 && Math.abs(next) < 0.01 ? 0 : next;
}
