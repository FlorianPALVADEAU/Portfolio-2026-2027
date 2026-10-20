import { Pop } from "@/components/atoms/pop";
import { PipelineDiagram } from "@/components/molecules/pipeline-diagram";
import { Frame } from "@/features/frame-rail";
import { pipelineStages, skillIcon } from "@/lib/landing";
import { FrameIntro } from "./frame-intro";
import type { GroupFrameProps } from "./frame-props";

/** Frame 2: the title above, then the whole delivery pipeline across the width of the screen. */
export function InfrastructureFrame({ order, total, messages }: GroupFrameProps) {
  const stages = pipelineStages.map(({ id, tools }) => ({
    id,
    label: messages.pipeline[id],
    tools: tools.map((tool) => ({ name: tool, icon: skillIcon(tool) })),
  }));

  return (
    <Frame aria-labelledby="skills-infrastructure" className="gap-8 md:gap-14">
      <FrameIntro
        order={order}
        total={total}
        titleId="skills-infrastructure"
        title={messages.groups.infrastructure.title}
        lead={messages.groups.infrastructure.lead}
      />
      <Pop from="scale" delay={0.2} className="origin-top-left">
        <div className="rounded-3xl border border-border bg-surface p-6 md:p-12">
          <PipelineDiagram stages={stages} automation="CI/CD" />
        </div>
      </Pop>
    </Frame>
  );
}
