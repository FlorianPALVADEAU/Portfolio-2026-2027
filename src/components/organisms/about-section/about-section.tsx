import { Text } from "@/components/atoms/text";
import { Timeline } from "@/components/molecules/timeline";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";
import { experience, formatPeriod } from "@/lib/landing";

type AboutSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["about"];
};

export function AboutSection({ index, title, messages }: AboutSectionProps) {
  const items = experience.map(({ id, organization, start, end }) => ({
    id,
    organization,
    period: formatPeriod(start, end, messages.present),
    title: messages.timeline.items[id].role,
    summary: messages.timeline.items[id].summary,
  }));

  return (
    <LandingSection id="about" index={index} title={title}>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {messages.paragraphs.map((paragraph) => (
            <Text key={paragraph} className="max-w-prose">
              {paragraph}
            </Text>
          ))}
        </div>
        <Timeline title={messages.timeline.title} items={items} />
      </div>
    </LandingSection>
  );
}
