import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/utils";

type StatFigureProps = {
  value: number;
  /** Shown after the number, such as `+`. */
  suffix?: string;
  label: string;
  /** `display` is for a figure that carries a whole frame. */
  size?: "default" | "display";
  className?: string;
};

/** A big number and what it counts. The frame rail counts the number up when the frame appears. */
export function StatFigure({
  value,
  suffix = "+",
  label,
  size = "default",
  className,
}: StatFigureProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p
        className={cn(
          "font-semibold tracking-tighter tabular-nums",
          size === "display"
            ? "text-5xl md:text-[clamp(4.5rem,8vw,8rem)] md:leading-none"
            : "text-4xl md:text-5xl",
        )}
      >
        <span data-count-to={value}>{value}</span>
        <span className="text-accent">{suffix}</span>
      </p>
      <Text size="sm" tone="muted">
        {label}
      </Text>
    </div>
  );
}
