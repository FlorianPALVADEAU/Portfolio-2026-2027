import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type TextBlockProps = {
  title?: string | undefined;
  paragraphs: readonly string[];
};

export function TextBlock({ title, paragraphs }: TextBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <Heading level={2} size="xl">
          {title}
        </Heading>
      )}
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} size="sm" className="max-w-[62ch] leading-relaxed">
          {paragraph}
        </Text>
      ))}
    </div>
  );
}
