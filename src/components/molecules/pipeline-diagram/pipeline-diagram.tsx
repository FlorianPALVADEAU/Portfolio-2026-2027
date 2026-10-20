import type { LucideIcon } from "lucide-react";
import { Fragment } from "react";
import { Icon } from "@/components/atoms/icon";
import { Pop } from "@/components/atoms/pop";
import { SkillChip } from "@/components/molecules/skill-chip";
import type { SkillIcon } from "@/lib/landing";
import { PipelineStage } from "./pipeline-stage";

type StageSpec = {
  id: string;
  label: string;
  note: string;
  icon: LucideIcon;
  tools: readonly { name: string; icon: SkillIcon | null }[];
};

type PipelineDiagramProps = {
  stages: readonly StageSpec[];
  /** Name of the automation that spans every stage but the last, such as `CI/CD`. */
  automation: string;
};

const STAGGER_SECONDS = 0.35;

/**
 * A delivery pipeline: one card per stage, joined by links on which a packet of light runs. Each
 * card pops in, left to right, the way a run goes, and opens a note on hover or tap. The automation label
 * spans every stage but the last. On small screens the cards stack and the links are dropped.
 */
export function PipelineDiagram({ stages, automation }: PipelineDiagramProps) {
  const last = stages.length - 1;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Pop from="grow" aria-hidden="true" className="w-full">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="rounded-full border border-accent bg-accent px-3 py-1 text-accent-foreground">
            {automation}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Pop>
      <ol className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:gap-0">
        {stages.map((stage, order) => (
          <Fragment key={stage.id}>
            <li className="group/stage">
              <Pop from="pop" delay={0.2 + order * STAGGER_SECONDS} className="h-full">
                <PipelineStage
                  order={order + 1}
                  label={stage.label}
                  note={stage.note}
                  icon={<Icon icon={stage.icon} size="lg" />}
                >
                  {stage.tools.length > 0 && (
                    <ul className="relative flex flex-wrap gap-2">
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
            {order < last && (
              <li
                aria-hidden="true"
                className="relative mt-[3.25rem] hidden h-px w-10 self-start overflow-hidden bg-border md:block lg:w-14"
              >
                <Pop
                  from="grow"
                  delay={0.5 + order * STAGGER_SECONDS}
                  className="absolute inset-0 bg-accent/40"
                />
                <span
                  className="absolute inset-y-0 left-0 w-1/4 bg-accent motion-safe:animate-[packet_2.4s_linear_infinite]"
                  style={{ animationDelay: `${order * 0.6}s` }}
                />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}
