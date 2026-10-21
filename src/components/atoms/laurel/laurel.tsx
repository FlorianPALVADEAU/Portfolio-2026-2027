import { cn } from "@/lib/utils";

const NODES = 9;
/** Stem as a quadratic curve bowing outwards: start, control and end, in the 32 by 104 view box. */
const STEM = { from: { x: 26, y: 100 }, control: { x: -4, y: 52 }, to: { x: 26, y: 4 } } as const;
const SPREAD_DEGREES = 50;

function leafAt(index: number) {
  const t = index / (NODES - 1);
  const mix = (a: number, b: number, c: number) =>
    (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t * t * c;
  const slope = (a: number, b: number, c: number) => 2 * (1 - t) * (b - a) + 2 * t * (c - b);
  const heading =
    (Math.atan2(
      slope(STEM.from.y, STEM.control.y, STEM.to.y),
      slope(STEM.from.x, STEM.control.x, STEM.to.x),
    ) *
      180) /
      Math.PI +
    90;
  return {
    x: mix(STEM.from.x, STEM.control.x, STEM.to.x),
    y: mix(STEM.from.y, STEM.control.y, STEM.to.y),
    heading,
    scale: 1 - 0.3 * t,
  };
}

const LEAVES = Array.from({ length: NODES }, (_, index) => leafAt(index));

type LaurelProps = {
  /** Mirrors the branch, so a pair frames a text. */
  flip?: boolean;
  className?: string;
};

/** One laurel branch in the current text colour; decorative. */
export function Laurel({ flip = false, className }: LaurelProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 104"
      className={cn("h-20 w-auto fill-current md:h-24", flip && "-scale-x-100", className)}
    >
      <path
        d={`M${STEM.from.x} ${STEM.from.y} Q${STEM.control.x} ${STEM.control.y} ${STEM.to.x} ${STEM.to.y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      {LEAVES.flatMap(({ x, y, heading, scale }, index) =>
        [-SPREAD_DEGREES, SPREAD_DEGREES].map((spread) => (
          <ellipse
            // biome-ignore lint/suspicious/noArrayIndexKey: the leaves are fixed geometry.
            key={`${index}-${spread}`}
            cx={0}
            cy={-7 * scale}
            rx={3 * scale}
            ry={7.5 * scale}
            transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(heading + spread).toFixed(1)})`}
          />
        )),
      )}
    </svg>
  );
}
