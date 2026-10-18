import { Badge } from "@/components/atoms/badge";
import { Heading } from "@/components/atoms/heading";
import { Stack } from "@/components/atoms/stack";

type StackBlockProps = {
  title: string;
  items: readonly string[];
};

export function StackBlock({ title, items }: StackBlockProps) {
  return (
    <Stack gap="sm">
      <Heading level={2}>{title}</Heading>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge variant="outline">{item}</Badge>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
