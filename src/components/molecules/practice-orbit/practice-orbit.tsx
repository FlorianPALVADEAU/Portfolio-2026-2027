import type { ReactNode } from "react";
import { Pop } from "@/components/atoms/pop";
import { SkillChip } from "@/components/molecules/skill-chip";

type PracticeOrbitProps = {
  practices: readonly string[];
  /** What sits in the middle of the ring. */
  children: ReactNode;
};

const STAGGER_SECONDS = 0.15;

/**
 * Practices placed evenly on a ring around a centrepiece. On small screens the ring is dropped
 * and the practices wrap in a row under the centrepiece.
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
        <circle cx="50" cy="50" r="49.5" fill="none" stroke="currentColor" strokeWidth="0.3" />
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 2"
          className="origin-center motion-safe:animate-[spin_120s_linear_infinite]"
        />
      </svg>
      <Pop from="scale" className="relative">
        {children}
      </Pop>
      <ul className="flex flex-wrap justify-center gap-2 md:static md:contents">
        {practices.map((practice, order) => (
          <li
            key={practice}
            className="md:absolute md:-translate-x-1/2 md:-translate-y-1/2"
            style={{
              left: `calc(50% + 50% * cos(${order * (360 / practices.length) - 90}deg))`,
              top: `calc(50% + 50% * sin(${order * (360 / practices.length) - 90}deg))`,
            }}
          >
            <Pop from="scale" delay={0.3 + order * STAGGER_SECONDS}>
              <SkillChip name={practice} icon={null} />
            </Pop>
          </li>
        ))}
      </ul>
    </div>
  );
}
