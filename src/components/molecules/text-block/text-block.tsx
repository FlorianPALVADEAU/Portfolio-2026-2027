import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type TextBlockProps = {
  title?: string | undefined;
  paragraphs: readonly string[];
};

export function TextBlock({ title, paragraphs }: TextBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      {title && (
        <Heading level={2} className="md:col-span-4">
          {title}
        </Heading>
      )}
      <div className="flex flex-col gap-4 md:col-span-7 md:col-start-6">
        {paragraphs.map((paragraph) => (
          <Text key={paragraph} size="lg" className="max-w-prose">
            {paragraph}
          </Text>
        ))}
      </div>
    </div>
  );
}
