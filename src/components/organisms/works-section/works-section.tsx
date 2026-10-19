import { Text } from "@/components/atoms/text";
import { ProjectCard } from "@/components/molecules/project-card";
import { LandingSection } from "@/components/organisms/landing-section";
import { ViewCursor } from "@/features/view-cursor";
import { WorksReel } from "@/features/works-reel";
import type { Locale, Messages } from "@/lib/i18n";

type WorksSectionProps = {
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

export function WorksSection({ title, locale, messages, projects }: WorksSectionProps) {
  return (
    <LandingSection id="works" title={title} tone="raised">
      <Text className="max-w-prose">
        {messages.description}
      </Text>
      <ViewCursor label={messages.view}>
        <WorksReel>
          <ul className="flex flex-col gap-24">
            {projects.map((project) => (
              <li key={project.slug} data-reel-cell>
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
        </WorksReel>
      </ViewCursor>
    </LandingSection>
  );
}
