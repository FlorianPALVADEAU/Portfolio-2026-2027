import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type StackBlockProps = {
  title: string;
  items: readonly string[];
};

export function StackBlock({ title, items }: StackBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={2} size="xl">
        {title}
      </Heading>
      <Text size="sm">{items.join(", ")}</Text>
    </div>
  );
}
