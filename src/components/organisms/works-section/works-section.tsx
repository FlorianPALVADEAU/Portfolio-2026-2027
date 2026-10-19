import { Text } from "@/components/atoms/text";
import { ProjectCard } from "@/components/molecules/project-card";
import { LandingSection } from "@/components/organisms/landing-section";
import { Scene } from "@/features/scene";
import type { Locale, Messages } from "@/lib/i18n";

type WorksSectionProps = {
  index: number;
  title: string;
  locale: Locale;
  messages: Messages["home"]["works"];
  projects: readonly {
    slug: string;
    title: string;
    summary: string;
    year: number;
    stack: readonly string[];
    cover: { src: string; width: number; height: number; alt: string };
  }[];
};

export function WorksSection({ index, title, locale, messages, projects }: WorksSectionProps) {
  return (
    <LandingSection id="works" index={index} title={title} backdrop={<Scene variant="accent" />}>
      <Text tone="muted" className="max-w-prose">
        {messages.description}
      </Text>
      <ul className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard
              href={`/${locale}/projects/${project.slug}`}
              title={project.title}
              summary={project.summary}
              year={project.year}
              stack={project.stack}
              cover={project.cover}
            />
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
