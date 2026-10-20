import { WaveArt } from "@/components/atoms/wave-art";
import type { SkillIcon } from "@/lib/landing";

type SkillCardProps = {
  /** Position in the list, shown as `01`; decorative. */
  index: number;
  name: string;
  /** Group the skill belongs to. */
  category: string;
  icon: SkillIcon | null;
};

/** A portrait card: the logo of a technology, or generated art for a practice, and its name. */
export function SkillCard({ index, name, category, icon }: SkillCardProps) {
  return (
    <div className="relative flex aspect-3/4 flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-colors duration-(--duration-base) in-data-active:border-accent">
      <WaveArt
        seed={index * 13 + name.length}
        className="absolute inset-0 size-full text-muted-foreground"
      />
      <div className="relative flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span aria-hidden="true">{String(index).padStart(2, "0")}</span>
        <span aria-hidden="true">{category}</span>
      </div>
      {icon && (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="relative size-16 fill-foreground in-data-active:fill-accent"
        >
          <path d={icon.path} />
        </svg>
      )}
      <p className="relative text-xl font-semibold tracking-tight text-balance hyphens-auto">
        {name}
      </p>
    </div>
  );
}
