import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type ResultsBlockProps = {
  title: string;
  items: readonly { label: string; value: string }[];
};

export function ResultsBlock({ title, items }: ResultsBlockProps) {
  return (
    <div className="flex flex-col gap-5">
      <Heading level={2} size="xl">
        {title}
      </Heading>
      <dl className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col-reverse justify-end gap-1">
            <dt>
              <Text as="span" size="sm">
                {item.label}
              </Text>
            </dt>
            <dd className="text-[clamp(2rem,3.5vw,3rem)] leading-none font-semibold tracking-tight">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
