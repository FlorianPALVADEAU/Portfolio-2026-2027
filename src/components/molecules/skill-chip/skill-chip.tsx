import { FlipText } from "@/components/atoms/flip-text";
import type { SkillIcon } from "@/lib/landing";

type SkillChipProps = {
  /** Shows the chip as picked, as hovering does; for chips that open something. */
  active?: boolean;
  name: string;
  /** Logo of the technology; practices and tools without one show the name alone. */
  icon: SkillIcon | null;
};

/** A pill with the logo and name of a skill. It lifts, takes the accent colour and rolls its letters on hover. */
export function SkillChip({ name, icon, active = false }: SkillChipProps) {
  return (
    <span
      data-active={active || undefined}
      className="group/chip flip-host inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-0.5 hover:border-accent hover:shadow-lg data-active:-translate-y-0.5 data-active:border-accent data-active:shadow-lg md:gap-2 md:px-3 md:py-1.5 md:text-sm"
    >
      {icon && (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="size-3.5 fill-muted-foreground transition-colors duration-(--duration-base) group-hover/chip:fill-accent md:size-4"
        >
          <path d={icon.path} />
        </svg>
      )}
      <FlipText>{name}</FlipText>
    </span>
  );
}
