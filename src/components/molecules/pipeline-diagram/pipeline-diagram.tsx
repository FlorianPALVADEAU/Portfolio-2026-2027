import { Check, type LucideIcon } from "lucide-react";
import { Fragment } from "react";
import { Icon } from "@/components/atoms/icon";
import { Pop } from "@/components/atoms/pop";
import { SkillChip } from "@/components/molecules/skill-chip";
import type { SkillIcon } from "@/lib/landing";

type PipelineStage = {
  id: string;
  label: string;
  icon: LucideIcon;
  tools: readonly { name: string; icon: SkillIcon | null }[];
};

type PipelineDiagramProps = {
  stages: readonly PipelineStage[];
  /** Name of the automation that spans every stage but the last, such as `CI/CD`. */
  automation: string;
};

const STAGGER_SECONDS = 0.35;

/**
 * A delivery pipeline: one card per stage, joined by links on which a packet of light runs. Each
 * card pops in, then ticks itself green, left to right, the way a run goes. The automation label
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
                <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-background p-3 md:gap-5 md:p-5 transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-1.5 hover:border-accent hover:shadow-lg">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-(--duration-slow) group-hover/stage:scale-x-100"
                  />
                  <div className="flex items-start justify-between">
                    <span className="flex size-9 items-center md:size-11 justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-(--duration-base) group-hover/stage:bg-accent group-hover/stage:text-accent-foreground">
                      <Icon icon={stage.icon} size="lg" />
                    </span>
                    <Pop from="pop" delay={0.9 + order * STAGGER_SECONDS} aria-hidden="true">
                      <span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Icon icon={Check} size="sm" />
                      </span>
                    </Pop>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-lg font-semibold md:text-xl">
                      <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                        {String(order + 1).padStart(2, "0")}
                      </span>
                      {stage.label}
                    </p>
                    {stage.tools.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {stage.tools.map((tool) => (
                          <li key={tool.name}>
                            <SkillChip name={tool.name} icon={tool.icon} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
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
