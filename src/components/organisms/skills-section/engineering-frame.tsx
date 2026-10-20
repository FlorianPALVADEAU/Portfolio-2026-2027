import Image from "next/image";
import type { ReactNode } from "react";
import { Pop } from "@/components/atoms/pop";
import { ExperienceTimeline } from "@/components/molecules/experience-timeline";
import { StatFigure } from "@/components/molecules/stat-figure";
import { Frame } from "@/features/frame-rail";
import { experiences, skillIcon, skillStats, timelineYears } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/**
 * Frame 1: the title of the section above a photo on the left, and on the right where each technology was put to work. The photo
 * drifts inside its mask while the counter card slides the other way, so the two sit at
 * different depths.
 */
export function EngineeringFrame({
  order,
  total,
  messages,
  children,
}: GroupFrameProps & { children: ReactNode }) {
  const entries = experiences.map(({ id, name, href, from, to, stack }) => ({
    id,
    name,
    href,
    role: messages.experiences[id],
    from,
    to: to ?? timelineYears.end,
    stack: stack.map((skill) => ({ name: skill, icon: skillIcon(skill) })),
  }));

  return (
    <Frame
      numeral="01"
      aria-labelledby="skills-engineering"
      className="gap-8 md:grid md:grid-cols-12 md:items-center md:gap-12"
    >
      <div className="flex flex-col gap-6 md:col-span-5">
        {children}
        <FrameIntro
          order={order}
          total={total}
          titleId="skills-engineering"
          title={messages.groups.engineering.title}
          lead={messages.groups.engineering.lead}
        />
        <div className="relative">
          <Pop
            from="wipe"
            delay={0.3}
            className="relative aspect-video overflow-hidden rounded-3xl md:aspect-4/3"
          >
            <div data-frame-parallax="0.09" className="absolute inset-y-0 -inset-x-[14%]">
              <Image
                src="/skills/engineering.jpg"
                alt=""
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
          </Pop>
          <div data-frame-parallax="-0.1" className="absolute -right-6 -bottom-6">
            <Pop from="pop" delay={0.9}>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-lg transition-[translate] duration-(--duration-base) hover:-translate-y-1">
                <StatFigure value={skillStats.features} label={messages.stats.features} />
              </div>
            </Pop>
          </div>
        </div>
      </div>
      <div className="md:col-span-7">
        <ExperienceTimeline
          entries={entries}
          startYear={timelineYears.start}
          endYear={timelineYears.end}
        />
      </div>
    </Frame>
  );
}
