import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type TimelineProps = {
  title: string;
  items: readonly {
    id: string;
    period: string;
    title: string;
    organization: string;
    summary: string;
  }[];
};

export function Timeline({ title, items }: TimelineProps) {
  return (
    <div className="flex flex-col gap-6">
      <Heading level={3} size="xl">
        {title}
      </Heading>
      <ol className="flex flex-col border-l border-border">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-1 py-4 pl-6">
            <Text as="span" size="sm" tone="muted" className="font-mono">
              {item.period}
            </Text>
            <p className="font-semibold">{`${item.title}, ${item.organization}`}</p>
            <Text size="sm" tone="muted" className="max-w-prose">
              {item.summary}
            </Text>
          </li>
        ))}
      </ol>
    </div>
  );
}
