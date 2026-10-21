export type TrailPoint = { x: number; y: number; time: number };

/** Closer points than this add no visible length, only cost. */
const MIN_STEP = 1.5;

/** Keeps the points still young enough to draw, and adds `next` when the pointer has really moved. */
export function extendTrail(
  points: readonly TrailPoint[],
  next: TrailPoint,
  lifetime: number,
): TrailPoint[] {
  const alive = pruneTrail(points, next.time, lifetime);
  const last = alive.at(-1);
  if (last && Math.hypot(next.x - last.x, next.y - last.y) < MIN_STEP) return alive;
  return [...alive, next];
}

export function pruneTrail(
  points: readonly TrailPoint[],
  now: number,
  lifetime: number,
): TrailPoint[] {
  return points.filter((point) => now - point.time < lifetime);
}

/** 1 for a point just laid down, falling to 0 as it reaches the end of its life. */
export function trailStrength(point: TrailPoint, now: number, lifetime: number): number {
  return Math.min(1, Math.max(0, 1 - (now - point.time) / lifetime));
}
