import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type ResultsBlockProps = {
  title: string;
  items: readonly { label: string; value: string }[];
};

export function ResultsBlock({ title, items }: ResultsBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <Heading level={2} className="md:col-span-4">
        {title}
      </Heading>
      <dl className="grid gap-8 sm:grid-cols-2 md:col-span-7 md:col-start-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col-reverse justify-end gap-1">
            <dt>
              <Text as="span">{item.label}</Text>
            </dt>
            <dd className="text-[clamp(2.75rem,6vw,5rem)] leading-none font-semibold tracking-tight">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
