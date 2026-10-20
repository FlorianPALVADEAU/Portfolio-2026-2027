import { ClipboardList, Globe } from "lucide-react";
import Image from "next/image";
import { Icon } from "@/components/atoms/icon";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { StatFigure } from "@/components/molecules/stat-figure";
import { Frame } from "@/features/frame-rail";
import { skillStats } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

const tile =
  "rounded-3xl border border-border bg-surface p-5 transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-1 hover:border-accent hover:shadow-lg";

/** Frame 4: a bento of tiles; a team photo on one side, the people and the needs on the other. */
export function CollaborationFrame({ order, total, messages }: GroupFrameProps) {
  const { items } = messages.groups.collaboration;

  return (
    <Frame
      aria-labelledby="skills-collaboration"
      className="gap-4 md:grid md:grid-cols-4 md:content-center md:gap-5"
    >
      <FrameIntro
        order={order}
        total={total}
        titleId="skills-collaboration"
        title={messages.groups.collaboration.title}
        lead={messages.groups.collaboration.lead}
        className="mb-4 md:col-span-2 md:mb-0 md:pr-8"
      />
      <Pop
        from="scale"
        delay={0.2}
        className="group/photo relative hidden overflow-hidden rounded-3xl md:col-span-2 md:row-span-3 md:block"
      >
        <div data-frame-parallax="0.04" className="absolute -inset-x-[12%] inset-y-0">
          <Image
            src="/skills/team.jpg"
            alt=""
            fill
            sizes="40vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover/photo:scale-105"
          />
        </div>
      </Pop>
      <Pop delay={0.25} className="h-full">
        <div className={`${tile} flex h-full flex-col justify-between gap-6`}>
          <Icon icon={Globe} size="lg" className="text-accent" />
          <div className="flex flex-col gap-4">
            <StatFigure
              value={skillStats.englishCountries}
              label={messages.stats.englishCountries}
            />
            <Text className="font-medium text-pretty">{items[0]}</Text>
          </div>
        </div>
      </Pop>
      <Pop delay={0.35} className="h-full">
        <div className={`${tile} flex h-full flex-col justify-between gap-6`}>
          <Icon icon={ClipboardList} size="lg" className="text-accent" />
          <Text className="text-xl font-semibold text-pretty">{items[1]}</Text>
        </div>
      </Pop>
      <Pop delay={0.45} className="md:col-span-2">
        <div className={`${tile} flex items-center gap-6 p-4`}>
          <div className="group/city relative aspect-3/2 w-1/3 shrink-0 overflow-hidden rounded-2xl">
            <Image
              src="/skills/city.jpg"
              alt=""
              fill
              sizes="20vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover/city:scale-110"
            />
          </div>
          <StatFigure value={skillStats.countries} label={messages.stats.countries} />
        </div>
      </Pop>
    </Frame>
  );
}
