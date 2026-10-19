import { Heading } from "@/components/atoms/heading";

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
      <ol className="flex flex-col gap-8">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-1">
            <p className="font-semibold tabular-nums">{item.period}</p>
            <p className="text-lg font-semibold">{`${item.title}, ${item.organization}`}</p>
            <p className="max-w-prose">{item.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
