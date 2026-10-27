import { Pop } from "@/components/atoms/pop";

type AgentFlowProps = {
  labels: {
    intent: string;
    lead: string;
    workers: readonly string[];
    result: string;
  };
};

const STAGGER_SECONDS = 0.25;
const draw =
  "transition-[stroke-dashoffset] duration-[1400ms] ease-out [stroke-dasharray:1] in-data-[reveal=off]:[stroke-dashoffset:1]";

/** Where worker `order` of `count` sits down the height of the fan, as a share from 0 to 100. */
const rowCentre = (order: number, count: number) => ((order + 0.5) / count) * 100;

/**
 * Work directed by AI, set as type: an intent goes to a lead agent, which fans out to specialised
 * sub-agents; what they return ends as a pull request a human reviews. The links draw themselves
 * in turn. On small screens the fan is dropped and the workers stack on a vertical rule.
 */
export function AgentFlow({ labels }: AgentFlowProps) {
  const count = labels.workers.length;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="grid items-center gap-5 md:grid-cols-[auto_minmax(3rem,1fr)_auto] md:gap-0">
        <Pop from="rise" className="flex flex-col gap-2">
          <p
            aria-hidden="true"
            className="font-mono text-xs tracking-widest text-muted-foreground uppercase"
          >
            {labels.intent}
          </p>
          <p className="text-4xl font-semibold tracking-tight md:text-[clamp(2rem,3.1vw,3.5rem)]">
            {labels.lead}
          </p>
        </Pop>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="hidden h-full min-h-28 w-full text-border md:block"
        >
          {labels.workers.map((worker, order) => (
            <path
              key={worker}
              d={`M0 50 C 50 50, 50 ${rowCentre(order, count)}, 100 ${rowCentre(order, count)}`}
              pathLength="1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className={draw}
              style={{ transitionDelay: `${0.4 + order * STAGGER_SECONDS}s` }}
            />
          ))}
        </svg>
        <ol
          className="grid border-l border-border pl-5 max-md:gap-4 md:min-h-28 md:border-l-0 md:pl-0"
          style={{ gridTemplateRows: `repeat(${count}, 1fr)` }}
        >
          {labels.workers.map((worker, order) => (
            <li key={worker} className="flex items-center">
              <Pop
                from="rise"
                delay={0.6 + order * STAGGER_SECONDS}
                className="flex items-baseline gap-3"
              >
                <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                  {String(order + 1).padStart(2, "0")}
                </span>
                <span className="text-3xl font-semibold tracking-tight md:text-[clamp(1.5rem,2.4vw,2.75rem)]">
                  {worker}
                </span>
              </Pop>
            </li>
          ))}
        </ol>
      </div>
      <Pop
        from="grow"
        delay={0.4 + count * STAGGER_SECONDS}
        className="flex w-full items-center gap-3 border-t border-border pt-4"
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {labels.result}
        </p>
      </Pop>
    </div>
  );
}
