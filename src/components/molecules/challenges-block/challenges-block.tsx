import { Heading } from "@/components/atoms/heading";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
import { Text } from "@/components/atoms/text";

type ChallengesBlockProps = {
  title: string;
  items: readonly { title: string; body: string }[];
};

export function ChallengesBlock({ title, items }: ChallengesBlockProps) {
  return (
    <div className="flex flex-col gap-5">
      <Heading level={2} size="xl">
        <RiseText>{title}</RiseText>
      </Heading>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li key={item.title}>
            <Heading level={3} size="lg">
              <RiseText>{item.title}</RiseText>
            </Heading>
            <Rise>
              <Text size="sm" className="mt-1 max-w-[62ch] leading-relaxed">
                {item.body}
              </Text>
            </Rise>
          </li>
        ))}
      </ul>
    </div>
  );
}
