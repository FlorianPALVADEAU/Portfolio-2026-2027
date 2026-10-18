import { Heading } from "@/components/atoms/heading";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";

type ChallengesBlockProps = {
  title: string;
  items: readonly { title: string; body: string }[];
};

export function ChallengesBlock({ title, items }: ChallengesBlockProps) {
  return (
    <Stack gap="sm">
      <Heading level={2}>{title}</Heading>
      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.title}>
            <Heading level={3} size="lg">
              {item.title}
            </Heading>
            <Text tone="muted" className="mt-2">
              {item.body}
            </Text>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
