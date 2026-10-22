import { Heading } from "@/components/atoms/heading";
import { RiseText } from "@/components/atoms/rise-text";
import { Text } from "@/components/atoms/text";

type ResultsBlockProps = {
  title: string;
  items: readonly { label: string; value: string }[];
};

export function ResultsBlock({ title, items }: ResultsBlockProps) {
  return (
    <div className="flex flex-col gap-5">
      <Heading level={2} size="xl">
        <RiseText>{title}</RiseText>
      </Heading>
      <dl className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 border-t py-2.5 first:border-t-0"
          >
            <dt className="min-w-0">
              <Text as="span" size="sm">
                {item.label}
              </Text>
            </dt>
            <dd className="shrink-0 text-right text-xl leading-tight font-semibold tracking-tight whitespace-nowrap tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
