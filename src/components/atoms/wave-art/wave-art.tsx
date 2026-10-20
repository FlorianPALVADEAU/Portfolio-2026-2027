import { cn } from "@/lib/utils";
import { createWave, randomWavePoints, wavePath } from "@/lib/wave";

const WIDTH = 300;
const HEIGHT = 400;
const SAMPLE_PX = 6;
const LINE_COUNT = 12;
/** Index of the line drawn in the accent colour. */
const ACCENT_LINE = 7;

type WaveArtProps = {
  /** Same seed, same picture. */
  seed: number;
  className?: string;
};

/**
 * Generated contour lines that fan out from the top of the frame, used where a card has no logo.
 * Decorative and drawn in `currentColor`, so the parent sets its tone.
 */
export function WaveArt({ seed, className }: WaveArtProps) {
  const wave = createWave(
    randomWavePoints({ seed, width: WIDTH, amplitude: 70, spacing: [70, 140] }),
  );
  const lines = Array.from({ length: LINE_COUNT }, (_, line) => ({
    id: `line-${line}`,
    accent: line === ACCENT_LINE,
    path: wavePath((x) => wave(x) * (0.3 + line * 0.12), {
      from: 0,
      to: WIDTH,
      step: SAMPLE_PX,
      baseline: 70 + line * 26,
    }),
  }));

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={cn("pointer-events-none", className)}
    >
      {lines.map(({ id, accent, path }) => (
        <path
          key={id}
          d={path}
          stroke={accent ? "var(--accent)" : "currentColor"}
          strokeOpacity={accent ? 0.9 : 0.35}
          strokeWidth={accent ? 1.5 : 1}
        />
      ))}
    </svg>
  );
}
