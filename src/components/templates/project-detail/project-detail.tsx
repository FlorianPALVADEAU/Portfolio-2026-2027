import { MediaBlock } from "@/components/molecules/media-block";
import { StoryPanel } from "@/components/molecules/story-panel";
import { type Block, BlockList } from "@/components/organisms/block-list";
import { ProjectIntro } from "@/components/organisms/project-intro";
import { ProjectOutro } from "@/components/organisms/project-outro";
import { MAIN_ID } from "@/features/route-focus";
import { StoryRail } from "@/features/story-rail";
import type { Locale, Messages } from "@/lib/i18n";

type ProjectDetailProps = {
  locale: Locale;
  messages: Messages["project"];
  /** The project to read after this one, if there is another. */
  next: { slug: string; title: string } | null;
  cvHref: string | null;
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
 * A project as a story: the intro, the first text blocks, the cover, the rest of the text as one
 * band of columns, the pictures, then where to go next. The stack and the links are lifted into the
 * intro, where they are seen first.
 */
/** Text blocks read before the cover; the rest of the text follows it. */
const TEXT_BEFORE_COVER = 3;

export function ProjectDetail({ locale, messages, next, cvHref, project }: ProjectDetailProps) {
  const stack = project.blocks.find((block) => block.type === "stack");
  const links = project.blocks.find((block) => block.type === "links");
  const story = project.blocks.filter((block) => block.type !== "stack" && block.type !== "links");
  const texts = story.filter((block) => block.type !== "media");
  const visuals = story.filter((block) => block.type === "media");

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <StoryRail label={messages.story}>
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
        <BlockList blocks={texts.slice(0, TEXT_BEFORE_COVER)} />
        <StoryPanel size="media">
          <MediaBlock image={project.cover} alt={project.cover.alt} priority />
        </StoryPanel>
        <BlockList blocks={texts.slice(TEXT_BEFORE_COVER)} />
        <BlockList blocks={visuals} />
        <ProjectOutro
          locale={locale}
          next={next}
          labels={{ next: messages.next, contact: messages.contact, cv: messages.cv }}
          cvHref={cvHref}
        />
      </StoryRail>
    </main>
  );
}
