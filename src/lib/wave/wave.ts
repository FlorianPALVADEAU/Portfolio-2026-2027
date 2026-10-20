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

/** The same curve, scaled in height and moved along `x`; a cheap way to get a companion line. */
export function echoWave(wave: Wave, { scale, shift }: { scale: number; shift: number }): Wave {
  return (x) => wave(x - shift) * scale;
}

/** SVG path data that samples `wave` every `step` pixels between `from` and `to`, around `baseline`. */
export function wavePath(
  wave: Wave,
  { from, to, step, baseline }: { from: number; to: number; step: number; baseline: number },
): string {
  const commands: string[] = [];
  for (let x = from; x < to + step; x += step) {
    const at = Math.min(x, to);
    commands.push(
      `${commands.length === 0 ? "M" : "L"}${at.toFixed(1)} ${(baseline + wave(at)).toFixed(1)}`,
    );
  }
  return commands.join("");
}
