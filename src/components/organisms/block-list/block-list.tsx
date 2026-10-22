import { ChallengesBlock } from "@/components/molecules/challenges-block";
import { LinksBlock } from "@/components/molecules/links-block";
import { MediaBlock } from "@/components/molecules/media-block";
import { ResultsBlock } from "@/components/molecules/results-block";
import { StackBlock } from "@/components/molecules/stack-block";
import { StoryPanel } from "@/components/molecules/story-panel";
import { TextBlock } from "@/components/molecules/text-block";

type Image = { src: string; width: number; height: number };

/** Mirrors the resolved content blocks produced by the content service. */
export type Block =
  | { id: string; type: "text"; title?: string | undefined; paragraphs: readonly string[] }
  | { id: string; type: "stack"; title: string; items: readonly string[] }
  | {
      id: string;
      type: "challenges";
      title: string;
      items: readonly { title: string; body: string }[];
    }
  | {
      id: string;
      type: "results";
      title: string;
      items: readonly { label: string; value: string }[];
    }
  | { id: string; type: "media"; image: Image; alt: string; caption?: string | undefined }
  | {
      id: string;
      type: "links";
      title: string;
      items: readonly { id: string; href: string }[];
      labels: Readonly<Record<string, string>>;
    };

function renderBlock(block: Block) {
  switch (block.type) {
    case "text":
      return <TextBlock title={block.title} paragraphs={block.paragraphs} />;
    case "stack":
      return <StackBlock title={block.title} items={block.items} />;
    case "challenges":
      return <ChallengesBlock title={block.title} items={block.items} />;
    case "results":
      return <ResultsBlock title={block.title} items={block.items} />;
    case "media":
      return <MediaBlock image={block.image} alt={block.alt} caption={block.caption} />;
    case "links":
      return <LinksBlock title={block.title} items={block.items} labels={block.labels} />;
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

type BlockListProps = {
  blocks: readonly Block[];
};

/** Runs of blocks that are not pictures stay together, so the text reads as one band. */
function groupBlocks(blocks: readonly Block[]): readonly (readonly Block[])[] {
  const groups: Block[][] = [];
  for (const block of blocks) {
    const last = groups.at(-1);
    if (last && last[0]?.type !== "media" && block.type !== "media") last.push(block);
    else groups.push([block]);
  }
  return groups;
}

/**
 * Story panels for a `StoryRail`, in the order authored: a picture gets a panel of its own, and
 * the blocks around it that are not pictures share one, as columns side by side.
 */
export function BlockList({ blocks }: BlockListProps) {
  return groupBlocks(blocks).map((group) => {
    const [first] = group;
    if (!first) return null;
    if (first.type === "media") {
      return (
        <StoryPanel key={first.id} size="media">
          {renderBlock(first)}
        </StoryPanel>
      );
    }
    return (
      <StoryPanel key={first.id} size="group">
        <div className="flex flex-col gap-12 group-data-[rail=on]/rail:w-[max-content] group-data-[rail=on]/rail:flex-row group-data-[rail=on]/rail:items-start group-data-[rail=on]/rail:gap-16">
          {group.map((block) => (
            <div
              key={block.id}
              className="group-data-[rail=on]/rail:w-[min(80vw,24rem)] group-data-[rail=on]/rail:shrink-0"
            >
              {renderBlock(block)}
            </div>
          ))}
        </div>
      </StoryPanel>
    );
  });
}
