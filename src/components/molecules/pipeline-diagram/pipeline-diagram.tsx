import { Pop } from "@/components/atoms/pop";
import { SkillChip } from "@/components/molecules/skill-chip";
import type { SkillIcon } from "@/lib/landing";
import { PipelineStage } from "./pipeline-stage";

type StageSpec = {
  id: string;
  label: string;
  note: string;
  tools: readonly { name: string; icon: SkillIcon | null }[];
};

type PipelineDiagramProps = {
  stages: readonly StageSpec[];
  /** Name of the automation that runs along every stage, such as `CI/CD`. */
  automation: string;
};

const STAGGER_SECONDS = 0.3;

/**
 * A delivery pipeline set as type: one big word per stage along a rule that a packet of light
 * runs down, left to right, the way a run goes. Words rise in turn and open a note on hover or
 * tap. On small screens the stages stack as rows on a vertical rule.
 */
export function PipelineDiagram({ stages, automation }: PipelineDiagramProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <Pop from="grow" aria-hidden="true" className="w-full">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {automation}
        </p>
      </Pop>
      <ol className="relative flex flex-col gap-5 border-l border-border pl-5 md:grid md:grid-cols-4 md:gap-10 md:border-t md:border-l-0 md:pt-8 md:pl-0">
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 hidden h-px w-1/4 bg-accent md:block motion-safe:animate-[packet_3.2s_linear_infinite]"
        />
        {stages.map((stage, order) => (
          <li key={stage.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-3 -left-[1.4rem] size-2 rounded-full bg-accent md:-top-[2.4rem] md:left-0 md:size-2.5"
            />
            <Pop from="rise" delay={0.2 + order * STAGGER_SECONDS} className="h-full">
              <PipelineStage order={order + 1} label={stage.label} note={stage.note}>
                {stage.tools.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 md:gap-2">
                    {stage.tools.map((tool) => (
                      <li key={tool.name}>
                        <SkillChip name={tool.name} icon={tool.icon} />
                      </li>
                    ))}
                  </ul>
                )}
              </PipelineStage>
            </Pop>
          </li>
        ))}
      </ol>
    </div>
  );
}
