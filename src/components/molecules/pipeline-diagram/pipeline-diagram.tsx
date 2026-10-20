import { Pop } from "@/components/atoms/pop";
import { SkillChip } from "@/components/molecules/skill-chip";
import type { SkillIcon } from "@/lib/landing";

type PipelineStage = {
  id: string;
  label: string;
  tools: readonly { name: string; icon: SkillIcon | null }[];
};

type PipelineDiagramProps = {
  stages: readonly PipelineStage[];
  /** Name of the automation that spans every stage but the last, such as `CI/CD`. */
  automation: string;
};

const STAGGER_SECONDS = 0.25;

/**
 * A delivery pipeline: numbered stages joined by lines that draw themselves, with the tools that
 * run each stage underneath. The automation label spans every stage but the last.
 */
export function PipelineDiagram({ stages, automation }: PipelineDiagramProps) {
  const last = stages.length - 1;

  return (
    <ol className="grid gap-x-4 gap-y-6 md:grid-cols-4">
      <li aria-hidden="true" className="md:col-span-3">
        <Pop from="scale" className="w-fit origin-left md:w-full">
          <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="rounded-full border border-accent px-3 py-1 text-accent">
              {automation}
            </span>
            <span className="hidden h-px flex-1 bg-border md:block" />
          </span>
        </Pop>
      </li>
      <li aria-hidden="true" className="hidden md:block" />
      {stages.map((stage, order) => (
        <li key={stage.id} className="relative flex gap-4 md:flex-col">
          <Pop
            from="scale"
            delay={0.2 + order * STAGGER_SECONDS}
            className="flex gap-4 md:flex-col"
          >
            <span className="group/stage flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-sm transition-[scale,background-color,color,border-color] duration-(--duration-base) hover:scale-110 hover:border-accent hover:bg-accent hover:text-accent-foreground">
              {String(order + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-3">
              <span className="text-xl font-semibold">{stage.label}</span>
              {stage.tools.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {stage.tools.map((tool) => (
                    <li key={tool.name}>
                      <SkillChip name={tool.name} icon={tool.icon} />
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </Pop>
          {order < last && (
            <Pop
              from="grow"
              delay={0.4 + order * STAGGER_SECONDS}
              aria-hidden="true"
              className="absolute top-6 left-16 hidden h-px w-[calc(100%-4rem)] bg-accent duration-700 md:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
