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
  /** The years spent there in words, such as "2023 – today". */
  period: string;
  /** True while the role goes on; its marker is filled with the accent. */
  current: boolean;
  stack: readonly { name: string; icon: SkillIcon | null }[];
};

type ExperienceTimelineProps = {
  entries: readonly TimelineEntry[];
};

const STAGGER_SECONDS = 0.18;

/**
 * A vertical timeline, newest first: a rule down the left with one marker per client, and beside
 * each marker the years in words, the company large, the role, and the technologies used there.
 * Each entry's text and chips come in one after the other when the frame is revealed.
 */
export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <ol className="relative flex flex-col gap-8 pl-7 md:gap-10 md:pl-10">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px bg-foreground/25"
      />
      {entries.map((entry, order) => (
        <li key={entry.id} className="relative flex flex-col gap-2 md:gap-3">
          <span
            aria-hidden="true"
            className={
              entry.current
                ? "absolute top-1.5 -left-7 size-3 rounded-full bg-accent ring-4 ring-accent/25 md:-left-10"
                : "absolute top-1.5 -left-7 size-3 rounded-full border-2 border-foreground/50 bg-background md:-left-10"
            }
          />
          <Pop delay={0.2 + order * STAGGER_SECONDS}>
            <Text as="p" size="sm" className="font-mono tracking-wide text-foreground/80">
              {entry.period}
            </Text>
          </Pop>
          <Pop from="wipe" delay={0.3 + order * STAGGER_SECONDS}>
            <Link
              href={entry.href}
              external
              className="group/link flip-host inline-flex items-center gap-1.5 text-3xl font-semibold tracking-tight no-underline md:text-4xl"
            >
              <FlipText>{entry.name}</FlipText>
              <Icon
                icon={ArrowUpRight}
                size="sm"
                className="transition-transform duration-(--duration-base) group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </Link>
          </Pop>
          <Pop delay={0.4 + order * STAGGER_SECONDS}>
            <Text as="p" size="sm" className="text-foreground/80">
              {entry.role}
            </Text>
          </Pop>
          <ul className="flex flex-wrap gap-1.5 md:gap-2">
            {entry.stack.map((skill, chip) => (
              <li key={skill.name}>
                <Pop from="pop" delay={0.5 + order * STAGGER_SECONDS + chip * 0.05}>
                  <SkillChip name={skill.name} icon={skill.icon} />
                </Pop>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
