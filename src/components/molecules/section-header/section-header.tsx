import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type SectionHeaderProps = {
  /** Position shown as `[01]`; decorative, so hidden from assistive technology. */
  index: number;
  title: string;
  /** Id of the heading, so the section can be labelled by it. */
  titleId: string;
};

export function SectionHeader({ index, title, titleId }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Text as="span" size="sm" tone="muted" className="font-mono" aria-hidden="true">
        {`[${String(index).padStart(2, "0")}]`}
      </Text>
      <Heading level={2} size="3xl" id={titleId}>
        {title}
      </Heading>
    </div>
  );
}
