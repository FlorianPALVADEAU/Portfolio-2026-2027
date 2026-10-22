import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type ChallengesBlockProps = {
  title: string;
  items: readonly { title: string; body: string }[];
};

export function ChallengesBlock({ title, items }: ChallengesBlockProps) {
  return (
    <div className="flex flex-col gap-5">
      <Heading level={2} size="xl">
        {title}
      </Heading>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.title}>
            <Heading level={3} size="lg">
              {item.title}
            </Heading>
            <Text size="sm" className="mt-1 max-w-[62ch] leading-relaxed">
              {item.body}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
