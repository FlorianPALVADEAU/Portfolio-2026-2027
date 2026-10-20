import { ArrowUpRight } from "lucide-react";
import { FlipText } from "@/components/atoms/flip-text";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { SkillChip } from "@/components/molecules/skill-chip";
import type { SkillIcon } from "@/lib/landing";

type TimelineEntry = {
  id: string;
  name: string;
  /** Website of the company or project. */
  href: string;
  role: string;
  /** Fractional years, such as 2023.7. */
  from: number;
  to: number;
  stack: readonly { name: string; icon: SkillIcon | null }[];
};

type ExperienceTimelineProps = {
  entries: readonly TimelineEntry[];
  startYear: number;
  endYear: number;
};

const STAGGER_SECONDS = 0.18;

/**
 * Rows along a shared year axis, set as type rather than cards: the company large, the role beside
 * it, a bar for how long, and the technologies used. Each row's rule draws, its bar grows from its
 * start date and its chips pop in one after the other when the frame is revealed.
 */
export function ExperienceTimeline({ entries, startYear, endYear }: ExperienceTimelineProps) {
  const span = endYear - startYear;
  const share = (year: number) => `${((year - startYear) / span) * 100}%`;
  const years = Array.from({ length: span + 1 }, (_, step) => startYear + step);

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div
        aria-hidden="true"
        className="relative h-4 font-mono text-xs text-foreground/70 max-md:[&>span:not(:first-child):not(:last-child)]:hidden"
      >
        {years.map((year) => (
          <span
            key={year}
            className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
            style={{ left: share(year) }}
          >
            {year}
          </span>
        ))}
      </div>
      <ol className="flex flex-col">
        {entries.map((entry, order) => (
          <li
            key={entry.id}
            className="group/lane relative flex flex-col gap-2 py-3 md:gap-3 md:py-5"
          >
            <Pop
              from="grow"
              delay={0.15 + order * STAGGER_SECONDS}
              className="absolute inset-x-0 top-0 h-px bg-foreground/25"
            >
              <span className="block size-full origin-left bg-foreground/0 transition-colors duration-(--duration-base) group-hover/lane:bg-accent" />
            </Pop>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <Pop from="wipe" delay={0.25 + order * STAGGER_SECONDS}>
                <Link
                  href={entry.href}
                  external
                  className="group/link flip-host inline-flex items-center gap-1.5 text-2xl font-semibold tracking-tight no-underline md:text-4xl"
                >
                  <FlipText>{entry.name}</FlipText>
                  <Icon
                    icon={ArrowUpRight}
                    size="sm"
                    className="transition-transform duration-(--duration-base) group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </Link>
              </Pop>
              <Pop delay={0.35 + order * STAGGER_SECONDS}>
                <Text as="span" size="sm" className="text-foreground/80">
                  {entry.role}
                </Text>
              </Pop>
            </div>
            <div aria-hidden="true" className="relative h-1.5 rounded-full bg-foreground/15">
              <div
                className="absolute inset-y-0"
                style={{
                  left: share(entry.from),
                  width: `${((entry.to - entry.from) / span) * 100}%`,
                }}
              >
                <Pop
                  from="grow"
                  delay={0.4 + order * STAGGER_SECONDS}
                  className="size-full rounded-full bg-accent duration-1000"
                />
              </div>
            </div>
            <ul className="flex flex-wrap gap-1.5 md:gap-2">
              {entry.stack.map((skill, chip) => (
                <li key={skill.name}>
                  <Pop from="pop" delay={0.55 + order * STAGGER_SECONDS + chip * 0.05}>
                    <SkillChip name={skill.name} icon={skill.icon} />
                  </Pop>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
