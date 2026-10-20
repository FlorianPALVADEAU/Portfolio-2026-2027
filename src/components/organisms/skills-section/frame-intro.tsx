import { Heading } from "@/components/atoms/heading";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/utils";

type FrameIntroProps = {
  /** Position of the frame, from 1, and the number of frames; shown as `01 / 04`. */
  order: number;
  total: number;
  titleId: string;
  title: string;
  lead: string;
  className?: string;
  /** Classes for the lead, such as `max-md:hidden` where the screen has no room for it. */
  leadClassName?: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

/** Number, title and one line about a frame; each part rises in turn when the frame appears. */
export function FrameIntro({
  order,
  total,
  titleId,
  title,
  lead,
  className,
  leadClassName,
}: FrameIntroProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Pop>
        <Text as="span" size="sm" tone="muted" className="font-mono" aria-hidden="true">
          {`${pad(order)} / ${pad(total)}`}
        </Text>
      </Pop>
      <Pop delay={0.08}>
        <Heading level={3} size="3xl" id={titleId}>
          {title}
        </Heading>
      </Pop>
      <Pop delay={0.16} className={leadClassName}>
        <Text tone="muted" className="max-w-md text-pretty">
          {lead}
        </Text>
      </Pop>
    </div>
  );
}
