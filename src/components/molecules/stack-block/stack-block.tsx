import { Heading } from "@/components/atoms/heading";
import { RiseText } from "@/components/atoms/rise-text";
import { Text } from "@/components/atoms/text";

type StackBlockProps = {
  title: string;
  items: readonly string[];
};

export function StackBlock({ title, items }: StackBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={2} size="xl">
        <RiseText>{title}</RiseText>
      </Heading>
      <Text size="sm">{items.join(", ")}</Text>
    </div>
  );
}
