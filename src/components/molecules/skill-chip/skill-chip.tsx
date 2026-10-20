import type { SkillIcon } from "@/lib/landing";

type SkillChipProps = {
  name: string;
  /** Logo of the technology; practices and tools without one show the name alone. */
  icon: SkillIcon | null;
};

/** A pill with the logo and name of a skill. It lifts and takes the accent colour on hover. */
export function SkillChip({ name, icon }: SkillChipProps) {
  return (
    <span className="group/chip inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-0.5 hover:border-accent hover:shadow-lg">
      {icon && (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="size-4 fill-muted-foreground transition-colors duration-(--duration-base) group-hover/chip:fill-accent"
        >
          <path d={icon.path} />
        </svg>
      )}
      {name}
    </span>
  );
}
