import { Heading } from "@/components/atoms/heading";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";

type TextBlockProps = {
  title?: string | undefined;
  paragraphs: readonly string[];
};

export function TextBlock({ title, paragraphs }: TextBlockProps) {
  return (
    <Stack gap="sm">
      {title && <Heading level={2}>{title}</Heading>}
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} className="max-w-prose">
          {paragraph}
        </Text>
      ))}
    </Stack>
  );
}
