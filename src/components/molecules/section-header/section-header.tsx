import { Heading } from "@/components/atoms/heading";

type SectionHeaderProps = {
  title: string;
  /** Id of the heading, so the section can be labelled by it. */
  titleId: string;
};

export function SectionHeader({ title, titleId }: SectionHeaderProps) {
  return (
    <Heading level={2} size="2xl" id={titleId}>
      {title}
    </Heading>
  );
}
