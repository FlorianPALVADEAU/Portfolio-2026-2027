import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/utils";

type StatFigureProps = {
  value: number;
  /** Shown after the number, such as `+`. */
  suffix?: string;
  label: string;
  className?: string;
};

/** A big number and what it counts. The frame rail counts the number up when the frame appears. */
export function StatFigure({ value, suffix = "+", label, className }: StatFigureProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-5xl font-semibold tracking-tighter tabular-nums">
        <span data-count-to={value}>{value}</span>
        <span className="text-accent">{suffix}</span>
      </p>
      <Text size="sm" tone="muted">
        {label}
      </Text>
    </div>
  );
}
