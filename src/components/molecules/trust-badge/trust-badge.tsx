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
        "flex items-center justify-center gap-3 text-center text-lg leading-tight text-balance text-foreground/70 md:gap-5 md:text-2xl",
        className,
      )}
    >
      <Laurel />
      <span className="max-w-[14ch] md:max-w-[18ch]">{text}</span>
      <Laurel flip />
    </p>
  );
}
