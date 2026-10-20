import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type SectionHeaderProps = {
  /** Position shown as `[01]`; decorative, so hidden from assistive technology. Omitted: no label. */
  index?: number | undefined;
  title: string;
  /** Id of the heading, so the section can be labelled by it. */
  titleId: string;
  size?: "2xl" | "3xl" | "display";
};

export function SectionHeader({ index, title, titleId, size = "3xl" }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      {index !== undefined && (
        <Text as="span" size="sm" tone="muted" className="font-mono" aria-hidden="true">
          {`[${String(index).padStart(2, "0")}]`}
        </Text>
      )}
      <Heading level={2} size={size} id={titleId}>
        {title}
      </Heading>
    </div>
  );
}
