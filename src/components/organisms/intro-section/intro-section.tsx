import { Text } from "@/components/atoms/text";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";

type IntroSectionProps = {
  index: number;
  title: string;
  messages: Messages["home"]["intro"];
};

export function IntroSection({ index, title, messages }: IntroSectionProps) {
  return (
    <LandingSection id="intro" index={index} title={title}>
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-end">
        <p className="text-balance text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          {messages.statement}
        </p>
        <Text tone="muted">{messages.aside}</Text>
      </div>
    </LandingSection>
  );
}
