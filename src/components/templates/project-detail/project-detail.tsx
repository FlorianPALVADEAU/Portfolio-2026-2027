import { MediaBlock } from "@/components/molecules/media-block";
import { StoryPanel } from "@/components/molecules/story-panel";
import { type Block, BlockList } from "@/components/organisms/block-list";
import { ProjectIntro } from "@/components/organisms/project-intro";
import { MAIN_ID } from "@/features/route-focus";
import { StoryRail } from "@/features/story-rail";
import type { Locale, Messages } from "@/lib/i18n";

type ProjectDetailProps = {
  locale: Locale;
  messages: Messages["project"];
  project: {
    title: string;
    summary: string;
    role: string;
    year: number;
    cover: { src: string; width: number; height: number; alt: string };
    blocks: readonly Block[];
  };
};

/**
 * A project as a story: the intro, the cover, then one panel per block. The stack and the links
 * are lifted into the intro, where they are seen first; every other block keeps its place.
 */
export function ProjectDetail({ locale, messages, project }: ProjectDetailProps) {
  const stack = project.blocks.find((block) => block.type === "stack");
  const links = project.blocks.find((block) => block.type === "links");
  const story = project.blocks.filter((block) => block.type !== "stack" && block.type !== "links");

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <StoryRail>
        <ProjectIntro
          locale={locale}
          title={project.title}
          summary={project.summary}
          back={messages.back}
          facts={[
            { label: messages.role, value: project.role },
            { label: messages.year, value: String(project.year) },
          ]}
          stack={stack?.type === "stack" ? { title: stack.title, items: stack.items } : null}
          links={
            links?.type === "links"
              ? links.items.map(({ id, href }) => ({ id, href, label: links.labels[id] ?? id }))
              : []
          }
        />
        <StoryPanel size="media">
          <MediaBlock image={project.cover} alt={project.cover.alt} priority />
        </StoryPanel>
        <BlockList blocks={story} />
      </StoryRail>
    </main>
  );
}
