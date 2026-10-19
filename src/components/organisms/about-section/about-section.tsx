import { Timeline } from "@/components/molecules/timeline";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";
import { experience, formatPeriod } from "@/lib/landing";

type AboutSectionProps = {
  title: string;
  messages: Messages["home"]["about"];
};

export function AboutSection({ title, messages }: AboutSectionProps) {
  const items = experience.map(({ id, organization, start, end }) => ({
    id,
    organization,
    period: formatPeriod(start, end, messages.present),
    title: messages.timeline.items[id].role,
    summary: messages.timeline.items[id].summary,
  }));

  return (
    <LandingSection id="about" title={title} tone="raised">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-5">
          {messages.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-prose text-lg">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Timeline title={messages.timeline.title} items={items} />
        </div>
      </div>
    </LandingSection>
  );
}
