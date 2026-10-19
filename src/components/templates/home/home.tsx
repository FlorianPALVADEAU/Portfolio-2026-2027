import type { ComponentProps, ReactNode } from "react";
import { AboutSection } from "@/components/organisms/about-section";
import { ContactSection } from "@/components/organisms/contact-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { IntroSection } from "@/components/organisms/intro-section";
import { LandingSection } from "@/components/organisms/landing-section";
import { SkillsSection } from "@/components/organisms/skills-section";
import { TechnologyBand } from "@/components/organisms/technology-band";
import { WorksSection } from "@/components/organisms/works-section";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";
import { landingSections } from "@/lib/landing";

type HomeProps = {
  locale: Locale;
  messages: Messages["home"];
  /** Public URL of the CV in this language, when the file exists. */
  cvHref?: string | null;
  projects: ComponentProps<typeof WorksSection>["projects"];
  /** Contact form, built by the route because it depends on server-side wiring. */
  contact?: ReactNode;
};

export function Home({ locale, messages, cvHref, projects, contact }: HomeProps) {
  const position = (id: (typeof landingSections)[number]) => landingSections.indexOf(id) + 1;
  const title = messages.sections;

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <HeroSection locale={locale} messages={messages} cvHref={cvHref ?? null} />
      <IntroSection
        title={title.intro}
        messages={messages.intro}
        photo={messages.photos.panorama}
      />
      <WorksSection
        index={position("works")}
        title={title.works}
        locale={locale}
        messages={messages.works}
        projects={projects}
      />
      <TechnologyBand messages={messages.marquee} />
      <SkillsSection index={position("skills")} title={title.skills} messages={messages.skills} />
      <AboutSection index={position("about")} title={title.about} messages={messages.about} />
      <LandingSection id="gallery" index={position("gallery")} title={title.gallery} tone="muted" />
      <ContactSection
        title={title.contact}
        messages={messages.contact}
        photo={messages.photos.closing}
      >
        {contact}
      </ContactSection>
    </main>
  );
}
