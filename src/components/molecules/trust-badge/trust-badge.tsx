import { Laurel } from "@/components/atoms/laurel";
import { cn } from "@/lib/utils";

type TrustBadgeProps = {
  text: string;
  className?: string;
};

/** A short claim between two laurel branches. */
export function TrustBadge({ text, className }: TrustBadgeProps) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-2 text-center text-sm leading-snug text-balance text-foreground/60 md:gap-3",
        className,
      )}
    >
      <Laurel className="h-12 md:h-14" />
      <span className="max-w-[16ch]">{text}</span>
      <Laurel flip className="h-12 md:h-14" />
    </p>
  );
}
