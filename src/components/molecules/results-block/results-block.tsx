import { Heading } from "@/components/atoms/heading";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";

type ResultsBlockProps = {
  title: string;
  items: readonly { label: string; value: string }[];
};

export function ResultsBlock({ title, items }: ResultsBlockProps) {
  return (
    <Stack gap="sm">
      <Heading level={2}>{title}</Heading>
      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt>
              <Text as="span" tone="muted" size="sm">
                {item.label}
              </Text>
            </dt>
            <dd className="text-3xl font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Stack>
  );
}
