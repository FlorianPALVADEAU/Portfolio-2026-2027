import type { ComponentProps } from "react";
import { AboutSection } from "@/components/organisms/about-section";
import { ContactSection } from "@/components/organisms/contact-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { IntroSection } from "@/components/organisms/intro-section";
import { SceneBackdrop } from "@/components/organisms/scene-backdrop";
import { SkillsSection } from "@/components/organisms/skills-section";
import { TechnologyBand } from "@/components/organisms/technology-band";
import { WorksSection } from "@/components/organisms/works-section";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";

type HomeProps = {
  locale: Locale;
  messages: Messages["home"];
  projects: ComponentProps<typeof WorksSection>["projects"];
};

export function Home({ locale, messages, projects }: HomeProps) {
  const title = messages.sections;

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <SceneBackdrop />
      <HeroSection locale={locale} messages={messages} />
      <IntroSection
        title={title.intro}
        messages={messages.intro}
        photo={messages.photos.panorama}
      />
      <WorksSection
        title={title.works}
        locale={locale}
        messages={messages.works}
        projects={projects}
      />
      <TechnologyBand messages={messages.marquee} />
      <SkillsSection title={title.skills} messages={messages.skills} />
      <AboutSection title={title.about} messages={messages.about} />
      <ContactSection
        title={title.contact}
        messages={messages.contact}
        photo={messages.photos.closing}
      />
    </main>
  );
}
