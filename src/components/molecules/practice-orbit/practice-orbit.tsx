import type { ReactNode } from "react";
import { Pop } from "@/components/atoms/pop";
import { SkillChip } from "@/components/molecules/skill-chip";

type PracticeOrbitProps = {
  practices: readonly string[];
  /** What sits in the middle of the ring. */
  children: ReactNode;
};

const STAGGER_SECONDS = 0.18;
const FIRST_ANGLE_DEG = -90;
/** Radius of the ring, in the 100-unit square of the drawing. */
const RING_RADIUS = 49.5;
/** Radius where the spokes start, clear of the centrepiece. */
const SPOKE_START = 22;

/** Where a practice sits on the ring, as a share of the width and height of the orbit. */
function place(order: number, count: number, radius = RING_RADIUS) {
  const angle = ((FIRST_ANGLE_DEG + order * (360 / count)) * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

const draw =
  "transition-[stroke-dashoffset,opacity] duration-[1400ms] ease-out [stroke-dasharray:1] in-data-[reveal=off]:[stroke-dashoffset:1]";

/**
 * Practices placed evenly on a ring around a centrepiece. The ring draws itself, a spoke reaches
 * out to each practice, and each practice then pops in. On small screens the ring is dropped and
 * the practices wrap in a row under the centrepiece.
 */
export function PracticeOrbit({ practices, children }: PracticeOrbitProps) {
  return (
    <div className="relative mx-auto flex w-full flex-col items-center gap-8 md:aspect-square md:w-[min(34rem,100%,62svh)] md:justify-center md:gap-0">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 100 100"
        className="absolute inset-0 hidden size-full text-border md:block"
      >
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          className={draw}
        />
        {practices.map((practice, order) => {
          const { x, y } = place(order, practices.length);
          const start = place(order, practices.length, SPOKE_START);
          return (
            <line
              key={practice}
              x1={start.x}
              y1={start.y}
              x2={x}
              y2={y}
              pathLength="1"
              stroke="currentColor"
              strokeWidth="0.2"
              className={draw}
              style={{ transitionDelay: `${0.5 + order * STAGGER_SECONDS}s` }}
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 2"
          className="origin-center transition-opacity duration-1000 in-data-[reveal=off]:opacity-0 motion-safe:animate-[spin_120s_linear_infinite]"
        />
      </svg>
      <Pop from="pop" delay={0.2} className="relative">
        {children}
      </Pop>
      <ul className="flex flex-wrap justify-center gap-2 md:static md:contents">
        {practices.map((practice, order) => {
          const { x, y } = place(order, practices.length);
          return (
            <li
              key={practice}
              className="md:absolute md:-translate-x-1/2 md:-translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <Pop from="pop" delay={0.7 + order * STAGGER_SECONDS}>
                <SkillChip name={practice} icon={null} />
              </Pop>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
