import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { SkillChip } from "@/components/molecules/skill-chip";
import type { SkillIcon } from "@/lib/landing";

type TimelineEntry = {
  id: string;
  name: string;
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
 * Lanes along a shared year axis: who, in which role, for how long, and the technologies used.
 * Each bar grows from its start date when its frame is revealed.
 */
export function ExperienceTimeline({ entries, startYear, endYear }: ExperienceTimelineProps) {
  const span = endYear - startYear;
  const share = (year: number) => `${((year - startYear) / span) * 100}%`;
  const years = Array.from({ length: span + 1 }, (_, step) => startYear + step);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div aria-hidden="true" className="relative h-4 font-mono text-xs text-muted-foreground">
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
      <ol className="flex flex-col gap-3 md:gap-5">
        {entries.map((entry, order) => (
          <li key={entry.id}>
            <Pop delay={0.2 + order * STAGGER_SECONDS}>
              <div className="group/lane flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 transition-[border-color,box-shadow] duration-(--duration-base) hover:border-accent hover:shadow-lg md:p-5 max-md:p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-lg font-semibold">{entry.name}</p>
                  <Text as="span" size="sm" tone="muted">
                    {entry.role}
                  </Text>
                </div>
                <div aria-hidden="true" className="relative h-2 rounded-full bg-muted">
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
                <ul className="flex flex-wrap gap-2">
                  {entry.stack.map((skill) => (
                    <li key={skill.name}>
                      <SkillChip name={skill.name} icon={skill.icon} />
                    </li>
                  ))}
                </ul>
              </div>
            </Pop>
          </li>
        ))}
      </ol>
    </div>
  );
}
