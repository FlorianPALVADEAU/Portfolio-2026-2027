import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { NODE_VARIANTS } from "./rail-variants";

type RailNodeProps = {
  /** Position along the rail, shown as `01`; decorative. */
  index: number;
  label: string;
};

/**
 * One skill. A plain list item until `WaveRail` takes over, then a label whose size, height and
 * entrance follow its place in the rhythm (see `NODE_VARIANTS`). Transforms are left to GSAP.
 */
export function RailNode({ index, label }: RailNodeProps) {
  const variant = NODE_VARIANTS[(index - 1) % NODE_VARIANTS.length] ?? NODE_VARIANTS[0];

  return (
    <li
      data-rail-node
      data-rail-offset={variant.offset}
      data-rail-reveal={variant.reveal}
      style={{ "--node-width": variant.width } as CSSProperties}
      className="in-data-[motion=rail]:relative in-data-[motion=rail]:h-0 in-data-[motion=rail]:w-[calc(var(--rail-pitch)*var(--node-width))] in-data-[motion=rail]:shrink-0"
    >
      <span
        data-rail-label
        className={cn(
          "flex flex-col gap-1 text-xl font-semibold tracking-tight text-balance in-data-[motion=rail]:absolute in-data-[motion=rail]:top-0 in-data-[motion=rail]:left-0 in-data-[motion=rail]:w-max in-data-[motion=rail]:max-w-[min(30rem,78vw)] in-data-[motion=rail]:hyphens-auto",
          variant.text,
        )}
      >
        <span aria-hidden="true" className="font-mono text-xs font-normal text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
        <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
          <span data-rail-text className="block">
            {label}
          </span>
        </span>
      </span>
    </li>
  );
}
