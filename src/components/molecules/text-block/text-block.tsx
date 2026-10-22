import { Heading } from "@/components/atoms/heading";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
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
          <RiseText>{title}</RiseText>
        </Heading>
      )}
      {paragraphs.map((paragraph) => (
        <Rise key={paragraph}>
          <Text size="sm" className="max-w-[62ch] leading-relaxed">
            {paragraph}
          </Text>
        </Rise>
      ))}
    </div>
  );
}
