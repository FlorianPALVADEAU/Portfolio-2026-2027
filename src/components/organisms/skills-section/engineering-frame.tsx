import Image from "next/image";
import { Pop } from "@/components/atoms/pop";
import { ExperienceTimeline } from "@/components/molecules/experience-timeline";
import { StatFigure } from "@/components/molecules/stat-figure";
import { Frame } from "@/features/frame-rail";
import { experiences, skillIcon, skillStats, timelineYears } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 1: a photo on the left, and on the right where each technology was put to work. */
export function EngineeringFrame({ order, total, messages }: GroupFrameProps) {
  const entries = experiences.map(({ id, name, from, to, stack }) => ({
    id,
    name,
    role: messages.experiences[id],
    from,
    to: to ?? timelineYears.end,
    stack: stack.map((skill) => ({ name: skill, icon: skillIcon(skill) })),
  }));

  return (
    <Frame
      aria-labelledby="skills-engineering"
      className="gap-8 md:grid md:grid-cols-12 md:items-center md:gap-12"
    >
      <div className="flex flex-col gap-8 md:col-span-5">
        <FrameIntro
          order={order}
          total={total}
          titleId="skills-engineering"
          title={messages.groups.engineering.title}
          lead={messages.groups.engineering.lead}
        />
        <Pop from="scale" delay={0.3} className="relative hidden md:block">
          <div className="relative overflow-hidden rounded-3xl">
            <div data-frame-parallax="0.04" className="scale-125">
              <Image
                src="/skills/engineering.jpg"
                alt=""
                width={1400}
                height={932}
                sizes="40vw"
                className="aspect-4/3 w-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -right-4 -bottom-6 rounded-2xl border border-border bg-surface p-5 shadow-lg transition-[translate] duration-(--duration-base) hover:-translate-y-1">
            <StatFigure value={skillStats.features} label={messages.stats.features} />
          </div>
        </Pop>
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
