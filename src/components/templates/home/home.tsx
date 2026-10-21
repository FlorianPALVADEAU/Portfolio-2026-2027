import type { ComponentProps, ReactNode } from "react";
import { AboutSection } from "@/components/organisms/about-section";
import { ContactSection } from "@/components/organisms/contact-section";
import { GallerySection } from "@/components/organisms/gallery-section";
import { HeroSection } from "@/components/organisms/hero-section";
import { IntroSection } from "@/components/organisms/intro-section";
import { SkillsSection } from "@/components/organisms/skills-section";
import { TechnologyBand } from "@/components/organisms/technology-band";
import { WorksSection } from "@/components/organisms/works-section";
import { MAIN_ID } from "@/features/route-focus";
import { ScrollHint } from "@/features/scroll-hint";
import type { Locale, Messages } from "@/lib/i18n";
import { landingSections } from "@/lib/landing";

type HomeProps = {
  locale: Locale;
  messages: Messages["home"];
  /** Public URL of the CV in this language, when the file exists. */
  cvHref?: string | null;
  /** Public URLs of the photos scattered on the hero. */
  heroPhotos?: readonly string[];
  /** Public URLs of the photos that follow the pointer in the about section. */
  trailPhotos?: readonly string[];
  projects: ComponentProps<typeof WorksSection>["projects"];
  /** Blocks of the contact section, built by the route because they depend on server-side wiring. */
  contact?: { form?: ReactNode; details?: ReactNode; activity?: ReactNode };
};

export function Home({
  locale,
  messages,
  cvHref,
  heroPhotos,
  trailPhotos,
  projects,
  contact,
}: HomeProps) {
  const position = (id: (typeof landingSections)[number]) => landingSections.indexOf(id) + 1;
  const title = messages.sections;

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <ScrollHint label={messages.scrollHint} />
      <HeroSection messages={messages} cvHref={cvHref ?? null} photos={heroPhotos ?? []} />
      <IntroSection title={title.intro} messages={messages.intro} controls={messages.marquee} />
      <AboutSection
        index={position("about")}
        title={title.about}
        messages={messages.about}
        trailPhotos={trailPhotos ?? []}
      />
      <WorksSection
        index={position("works")}
        title={title.works}
        locale={locale}
        messages={messages.works}
        projects={projects}
      />
      <TechnologyBand messages={messages.marquee} />
      <SkillsSection
        index={position("skills")}
        title={title.skills}
        messages={messages.skills}
        photo={messages.photos.closing}
      />
      <GallerySection
        index={position("gallery")}
        title={title.gallery}
        closingTitle={title.contact}
        messages={messages.gallery}
      />
      <ContactSection
        index={position("contact")}
        title={title.contact}
        messages={messages.contact}
        {...contact}
      />
    </main>
  );
}
