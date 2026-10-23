import Image from "next/image";
import type { ReactNode } from "react";
import { Pop } from "@/components/atoms/pop";
import { ExperienceTimeline } from "@/components/molecules/experience-timeline";
import { StatFigure } from "@/components/molecules/stat-figure";
import { Frame } from "@/features/frame-rail";
import { experiences, skillIcon, skillStats } from "@/lib/landing";
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
  // Newest first, as a CV reads.
  const entries = [...experiences].reverse().map(({ id, name, href, from, to, stack }) => ({
    id,
    name,
    href,
    role: messages.experiences[id],
    period: `${Math.floor(from)} – ${to === null ? messages.timeline.today : Math.floor(to)}`,
    current: to === null,
    stack: stack.map((skill) => ({ name: skill, icon: skillIcon(skill) })),
  }));

  return (
    <Frame
      aria-labelledby="skills-engineering"
      className="gap-6 md:grid md:grid-cols-12 md:items-center md:gap-12"
    >
      <div className="flex flex-col gap-6 md:col-span-5">
        {children}
        <FrameIntro
          order={order}
          total={total}
          titleId="skills-engineering"
          title={messages.groups.engineering.title}
          lead={messages.groups.engineering.lead}
          leadClassName="max-md:hidden"
        />
        <Pop from="pop" delay={0.3} className="md:hidden">
          <StatFigure
            value={skillStats.features}
            label={messages.stats.features}
            className="flex-row items-baseline gap-3"
          />
        </Pop>
        <div className="relative max-md:hidden">
          <Pop
            from="wipe"
            delay={0.3}
            className="relative aspect-[5/2] overflow-hidden rounded-3xl md:aspect-video"
          >
            <div data-frame-parallax="0.09" className="absolute inset-y-0 -inset-x-[14%]">
              <Image
                src="/gallery/whiteboard.webp"
                alt=""
                fill
                sizes="60vw"
                quality={92}
                className="object-cover"
              />
            </div>
          </Pop>
          <div
            data-frame-parallax="-0.1"
            className="absolute right-3 -bottom-4 md:-right-6 md:-bottom-6"
          >
            <Pop from="pop" delay={0.9}>
              <div className="rounded-2xl border border-border bg-surface p-3 shadow-lg md:p-5 transition-[translate] duration-(--duration-base) hover:-translate-y-1">
                <StatFigure value={skillStats.features} label={messages.stats.features} />
              </div>
            </Pop>
          </div>
        </div>
      </div>
      <div className="md:col-span-7">
        <ExperienceTimeline entries={entries} />
      </div>
    </Frame>
  );
}
