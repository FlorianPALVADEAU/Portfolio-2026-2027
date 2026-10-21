import Image from "next/image";
import { clients } from "@/lib/landing";
import { cn } from "@/lib/utils";

/** Which ground the row sits on, so the logos can be drawn the other way round. */
const GROUND_FILTERS = {
  paper: { source: "brightness-0", onWhite: "mix-blend-multiply" },
  ink: { source: "brightness-0 invert", onWhite: "invert" },
} as const;

type ClientLogosProps = {
  /** Heading of the list, shown above it. */
  label: string;
  /** "paper" is a light ground and gets dark logos; "ink" is a dark one and gets light logos. */
  ground: keyof typeof GROUND_FILTERS;
  className?: string;
};

/**
 * The companies worked with, as a still row in a single colour. The logo files are either light on
 * transparent or dark on an opaque white, and each kind needs its own treatment to fit the ground.
 */
export function ClientLogos({ label, ground, className }: ClientLogosProps) {
  const filters = GROUND_FILTERS[ground];
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="font-mono text-sm tracking-widest uppercase opacity-70">{label}</p>
      <ul aria-label={label} className="flex flex-wrap items-center gap-x-8 gap-y-5 md:gap-x-12">
        {clients.map(({ id, name, width, height, onWhite }) => (
          <li key={id}>
            <Image
              src={`/brand/companies/${id}.svg`}
              alt={name}
              width={width}
              height={height}
              unoptimized
              className={cn(
                "h-5 w-auto opacity-80 md:h-6",
                onWhite ? filters.onWhite : filters.source,
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
