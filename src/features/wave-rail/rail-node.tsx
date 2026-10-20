type RailNodeProps = {
  /** Position along the rail, shown as `01`; decorative. */
  index: number;
  label: string;
};

/**
 * One point of the wave. Plain list item until `WaveRail` takes over, then a dot that sits on the
 * curve with its label on the outer side. Transforms are left to GSAP, so offsets use margins.
 */
export function RailNode({ index, label }: RailNodeProps) {
  return (
    <li
      data-rail-node
      className="relative flex items-start gap-4 in-data-[motion=rail]:block in-data-[motion=rail]:h-0 in-data-[motion=rail]:w-(--rail-pitch) in-data-[motion=rail]:shrink-0"
    >
      <span
        aria-hidden="true"
        data-rail-dot
        className="relative mt-2 block size-4 shrink-0 rounded-full border-2 border-accent bg-background in-data-[motion=rail]:absolute in-data-[motion=rail]:top-0 in-data-[motion=rail]:left-0 in-data-[motion=rail]:z-10 in-data-[motion=rail]:-mt-2 in-data-[motion=rail]:-ml-2"
      >
        <span data-rail-fill className="absolute inset-0.5 rounded-full bg-accent" />
      </span>
      <span
        aria-hidden="true"
        data-rail-stem
        className="hidden h-8 w-px bg-accent in-data-[motion=rail]:absolute in-data-[motion=rail]:top-0 in-data-[motion=rail]:left-0 in-data-[motion=rail]:block"
      />
      <span
        data-rail-label
        className="flex flex-col gap-1 text-xl font-semibold tracking-tight text-balance in-data-[motion=rail]:absolute in-data-[motion=rail]:top-0 in-data-[motion=rail]:left-4 in-data-[motion=rail]:w-[calc(var(--rail-pitch)-2rem)] in-data-[motion=rail]:text-2xl in-data-[motion=rail]:[overflow-wrap:anywhere] in-data-[motion=rail]:hyphens-auto"
      >
        <span aria-hidden="true" className="font-mono text-xs font-normal text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
        {label}
      </span>
    </li>
  );
}
