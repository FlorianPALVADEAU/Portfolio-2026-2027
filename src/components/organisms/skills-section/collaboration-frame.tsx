import Image from "next/image";
import { FlipText } from "@/components/atoms/flip-text";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { StatFigure } from "@/components/molecules/stat-figure";
import { Frame } from "@/features/frame-rail";
import { skillStats } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/**
 * Frame 4: set as a page of a magazine rather than a grid of tiles. Two huge figures under the
 * title, two lines of prose between rules, and a tall photo whose frame wipes open.
 */
export function CollaborationFrame({ order, total, messages }: GroupFrameProps) {
  const { items } = messages.groups.collaboration;

  return (
    <Frame
      numeral="04"
      aria-labelledby="skills-collaboration"
      className="gap-5 md:grid md:grid-cols-12 md:items-center md:gap-14"
    >
      <div className="flex flex-col gap-5 md:col-span-6 md:gap-10">
        <FrameIntro
          order={order}
          total={total}
          titleId="skills-collaboration"
          title={messages.groups.collaboration.title}
          lead={messages.groups.collaboration.lead}
        />
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <Pop delay={0.25}>
            <StatFigure
              size="display"
              value={skillStats.englishCountries}
              label={messages.stats.englishCountries}
            />
          </Pop>
          <Pop delay={0.4}>
            <StatFigure
              size="display"
              value={skillStats.countries}
              label={messages.stats.countries}
            />
          </Pop>
        </div>
        <ol className="flex flex-col">
          {items.map((item, index) => (
            <li key={item} className="flip-host relative flex items-baseline gap-4 py-2.5 md:py-4">
              <Pop
                from="grow"
                delay={0.5 + index * 0.2}
                className="absolute inset-x-0 top-0 h-px bg-foreground/25"
              />
              <Pop from="wipe" delay={0.6 + index * 0.2} className="flex items-baseline gap-4">
                <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Text className="text-lg font-medium text-pretty md:text-xl">
                  <FlipText>{item}</FlipText>
                </Text>
              </Pop>
            </li>
          ))}
        </ol>
      </div>
      <Pop
        from="wipe"
        delay={0.2}
        className="group/photo relative aspect-[5/2] overflow-hidden rounded-3xl md:col-span-6 md:aspect-auto md:h-[62svh]"
      >
        <div data-frame-parallax="0.1" className="absolute inset-y-0 -inset-x-[16%]">
          <Image
            src="/skills/team.jpg"
            alt=""
            fill
            sizes="45vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover/photo:scale-105"
          />
        </div>
      </Pop>
    </Frame>
  );
}
