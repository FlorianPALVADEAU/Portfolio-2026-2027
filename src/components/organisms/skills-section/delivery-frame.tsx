import { PracticeOrbit } from "@/components/molecules/practice-orbit";
import { StatFigure } from "@/components/molecules/stat-figure";
import { Frame } from "@/features/frame-rail";
import { skillStats } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 3: the practices on a ring around the number of people the software serves. */
export function DeliveryFrame({ order, total, messages }: GroupFrameProps) {
  return (
    <Frame
      numeral="03"
      aria-labelledby="skills-delivery"
      className="gap-8 md:grid md:grid-cols-12 md:items-center md:gap-12"
    >
      <div className="md:order-2 md:col-span-5">
        <FrameIntro
          order={order}
          total={total}
          titleId="skills-delivery"
          title={messages.groups.delivery.title}
          lead={messages.groups.delivery.lead}
        />
      </div>
      <div className="md:order-1 md:col-span-7">
        <PracticeOrbit
          practices={messages.groups.delivery.items.map((name, index) => ({
            name,
            note: messages.groups.delivery.notes[index] ?? "",
          }))}
        >
          <StatFigure
            value={skillStats.users}
            label={messages.stats.users}
            className="max-w-48 text-center md:items-center"
          />
        </PracticeOrbit>
      </div>
    </Frame>
  );
}
