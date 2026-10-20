export type WavePoint = { x: number; y: number };

export type Wave = (x: number) => number;

/**
 * A curve that passes through every point, which must be sorted by `x`. Neighbours are joined
 * with a cosine ease, so the curve is flat at each point and its height can be read at any `x`
 * without measuring a path. Before the first point and after the last it stays level.
 */
export function createWave(points: readonly WavePoint[]): Wave {
  return (x) => {
    const first = points[0];
    const last = points.at(-1);
    if (!(first && last)) return 0;
    if (x <= first.x) return first.y;
    if (x >= last.x) return last.y;

    for (let index = 1; index < points.length; index++) {
      const from = points[index - 1];
      const to = points[index];
      if (from && to && x <= to.x) {
        const progress = (x - from.x) / (to.x - from.x);
        return from.y + ((to.y - from.y) * (1 - Math.cos(Math.PI * progress))) / 2;
      }
    }
    return last.y;
  };
}

/** Small seeded generator, so a "random" wave is the same on every visit and in every test. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

type RandomWave = {
  seed: number;
  width: number;
  /** Largest distance of a crest or a trough from the middle line. */
  amplitude: number;
  /** Shortest and longest distance between two turning points. */
  spacing: readonly [number, number];
};

/**
 * Turning points that run from `0` to `width`. Crests and troughs alternate, but their height
 * and their distance vary, so the line wanders instead of repeating.
 */
export function randomWavePoints({ seed, width, amplitude, spacing }: RandomWave): WavePoint[] {
  const random = seeded(seed);
  const [shortest, longest] = spacing;
  const points: WavePoint[] = [{ x: 0, y: 0 }];
  let x = 0;
  let side = random() < 0.5 ? -1 : 1;
  while (x < width) {
    x = Math.min(width, x + shortest + random() * (longest - shortest));
    points.push({ x, y: side * amplitude * (0.35 + random() * 0.65) });
    side = -side;
  }
  return points;
}

/** SVG path data that samples `wave` every `step` pixels between `from` and `to`, around `baseline`. */
export function wavePath(
  wave: Wave,
  { from, to, step, baseline }: { from: number; to: number; step: number; baseline: number },
): string {
  const commands: string[] = [];
  for (let x = from; x < to + step; x += step) {
    const at = Math.min(x, to);
    const y = (baseline + wave(at)).toFixed(1);
    commands.push(`${commands.length === 0 ? "M" : "L"}${at.toFixed(1)} ${y}`);
  }
  return commands.join("");
}
