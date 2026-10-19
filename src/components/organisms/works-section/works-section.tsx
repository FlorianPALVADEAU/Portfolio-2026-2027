import { Text } from "@/components/atoms/text";
import { ProjectCard } from "@/components/molecules/project-card";
import { LandingSection } from "@/components/organisms/landing-section";
import { ViewCursor } from "@/features/view-cursor";
import { WorksReel } from "@/features/works-reel";
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
    <LandingSection
      id="works"
      index={index}
      title={title}
      tone="raised"
      className="-mt-10 rounded-t-[2.5rem] border-t border-border md:-mt-16 md:rounded-t-[4rem]"
    >
      <Text tone="muted" className="max-w-prose">
        {messages.description}
      </Text>
      <ViewCursor label={messages.view}>
        <WorksReel>
          <ul className="grid gap-16 lg:grid-cols-2 lg:gap-x-10">
            {projects.map((project) => (
              <li key={project.slug} data-reel-cell className="only:lg:col-span-2">
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
