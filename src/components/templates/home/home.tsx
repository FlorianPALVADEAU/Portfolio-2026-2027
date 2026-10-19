import type { ComponentProps } from "react";
import { AboutSection } from "@/components/organisms/about-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { IntroSection } from "@/components/organisms/intro-section";
import { LandingSection } from "@/components/organisms/landing-section";
import { SkillsSection } from "@/components/organisms/skills-section";
import { WorksSection } from "@/components/organisms/works-section";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";
import { landingSections } from "@/lib/landing";

type HomeProps = {
  locale: Locale;
  messages: Messages["home"];
  projects: ComponentProps<typeof WorksSection>["projects"];
};

export function Home({ locale, messages, projects }: HomeProps) {
  const position = (id: (typeof landingSections)[number]) => landingSections.indexOf(id) + 1;
  const title = messages.sections;

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <HeroSection locale={locale} messages={messages} />
      <IntroSection index={position("intro")} title={title.intro} messages={messages.intro} />
      <WorksSection
        index={position("works")}
        title={title.works}
        locale={locale}
        messages={messages.works}
        projects={projects}
      />
      <SkillsSection index={position("skills")} title={title.skills} messages={messages.skills} />
      <AboutSection index={position("about")} title={title.about} messages={messages.about} />
      <LandingSection id="gallery" index={position("gallery")} title={title.gallery} />
      <LandingSection id="contact" index={position("contact")} title={title.contact} />
    </main>
  );
}
