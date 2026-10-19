import { ChallengesBlock } from "@/components/molecules/challenges-block";
import { LinksBlock } from "@/components/molecules/links-block";
import { MediaBlock } from "@/components/molecules/media-block";
import { ResultsBlock } from "@/components/molecules/results-block";
import { StackBlock } from "@/components/molecules/stack-block";
import { TextBlock } from "@/components/molecules/text-block";
import { Reveal } from "@/features/reveal";

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

export function BlockList({ blocks }: BlockListProps) {
  return (
    <Reveal className="flex flex-col gap-(--section-space)">
      {blocks.map((block) => (
        <div key={block.id}>{renderBlock(block)}</div>
      ))}
    </Reveal>
  );
}
