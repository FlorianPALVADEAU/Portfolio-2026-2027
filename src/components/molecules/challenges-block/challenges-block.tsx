import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type ChallengesBlockProps = {
  title: string;
  items: readonly { title: string; body: string }[];
};

export function ChallengesBlock({ title, items }: ChallengesBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <Heading level={2} className="md:col-span-4">
        {title}
      </Heading>
      <ul className="flex flex-col gap-8 md:col-span-7 md:col-start-6">
        {items.map((item) => (
          <li key={item.title}>
            <Heading level={3} size="xl">
              {item.title}
            </Heading>
            <Text size="lg" className="mt-2 max-w-prose">
              {item.body}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
