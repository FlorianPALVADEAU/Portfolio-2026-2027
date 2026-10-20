import { PipelineDiagram } from "@/components/molecules/pipeline-diagram";
import { Frame } from "@/features/frame-rail";
import { pipelineStages, skillIcon } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 2: the title above, then the whole delivery pipeline across the width of the screen, set as type. */
export function InfrastructureFrame({ order, total, messages }: GroupFrameProps) {
  const stages = pipelineStages.map(({ id, tools }) => ({
    id,
    label: messages.pipeline[id],
    note: messages.pipelineNotes[id],
    tools: tools.map((tool) => ({ name: tool, icon: skillIcon(tool) })),
  }));

  return (
    <Frame
      numeral="02"
      aria-labelledby="skills-infrastructure"
      className="gap-6 in-data-[motion=rail]:justify-start md:gap-16 md:in-data-[motion=rail]:justify-center"
    >
      <FrameIntro
        order={order}
        total={total}
        titleId="skills-infrastructure"
        title={messages.groups.infrastructure.title}
        lead={messages.groups.infrastructure.lead}
      />
      <PipelineDiagram stages={stages} automation="CI/CD" />
    </Frame>
  );
}
