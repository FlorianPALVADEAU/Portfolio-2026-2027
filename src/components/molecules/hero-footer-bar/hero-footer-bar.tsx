import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

type HeroFooterBarProps = {
  /** Availability line, set in the pill with its live dot. */
  badge: string;
  /** Label of the CV button; the button is left out without a `cvHref`. */
  cv: string;
  cvHref?: string | null;
  className?: string;
};

/** One chrome for both ends of the bar, so the badge and the button can never drift apart. */
const pill = "h-10 rounded-full border-foreground/40 bg-foreground/10 px-5 backdrop-blur-md";

/** The strip at the foot of the hero: availability on one side, the CV download on the other. */
export function HeroFooterBar({ badge, cv, cvHref = null, className }: HeroFooterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 font-mono text-xs tracking-widest text-foreground uppercase md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 [text-shadow:0_1px_12px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <span
        data-intro-step="3"
        className={cn(
          pill,
          "inline-flex w-full max-w-xs items-center justify-center gap-2.5 border text-center md:w-auto md:max-w-none md:justify-self-start",
        )}
      >
        <span aria-hidden="true" className="relative flex size-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-available motion-reduce:hidden" />
          <span className="relative size-2 rounded-full bg-available" />
        </span>
        {badge}
      </span>
      <span aria-hidden="true" className="hidden md:block" />
      {cvHref && (
        <Button
          asChild
          data-intro-step="3"
          variant="outline"
          className={cn(
            pill,
            "w-full max-w-xs font-mono text-xs tracking-widest uppercase hover:bg-foreground/20 md:w-auto md:max-w-none md:justify-self-end",
          )}
        >
          <a href={cvHref} download className="no-underline">
            {cv}
          </a>
        </Button>
      )}
    </div>
  );
}
