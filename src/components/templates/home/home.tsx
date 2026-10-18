import { HeroSection } from "@/components/organisms/hero-section";
import { LandingSection } from "@/components/organisms/landing-section";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";
import { landingSections } from "@/lib/landing";

type HomeProps = {
  locale: Locale;
  messages: Messages["home"];
};

export function Home({ locale, messages }: HomeProps) {
  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <HeroSection locale={locale} messages={messages} />
      {landingSections.map((id, index) => (
        <LandingSection key={id} id={id} index={index + 1} title={messages.sections[id]} />
      ))}
    </main>
  );
}
