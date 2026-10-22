import { ArrowLeft, ArrowRight } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import type { Locale } from "@/lib/i18n";

type ProjectBarProps = {
  locale: Locale;
  labels: { back: string; next: string };
  /** The project to read next; `null` leaves the way back alone. */
  next: { slug: string } | null;
};

const BUTTON =
  "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-sm no-underline backdrop-blur-md transition-colors";

/**
 * Small screens: the two ways out of a story share the foot of the screen, half each, where a
 * thumb reaches them. Large screens keep the corner button of `ProjectBack` instead.
 */
export function ProjectBar({ locale, labels, next }: ProjectBarProps) {
  return (
    <div className="pill-in fixed inset-x-0 bottom-0 z-40 flex gap-2 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <Link
        href={`/${locale}#works`}
        data-restore-scroll=""
        data-no-cover=""
        className={`${BUTTON} border-border bg-background/80 hover:border-accent`}
      >
        <Icon icon={ArrowLeft} size="sm" />
        {labels.back}
      </Link>
      {next && (
        <Link
          href={`/${locale}/projects/${next.slug}`}
          className={`${BUTTON} border-foreground bg-foreground text-background hover:border-accent`}
        >
          {labels.next}
          <Icon icon={ArrowRight} size="sm" />
        </Link>
      )}
    </div>
  );
}
