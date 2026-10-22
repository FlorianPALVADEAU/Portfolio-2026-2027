import { Link } from "@/components/atoms/link";
import { RiseText } from "@/components/atoms/rise-text";
import { StoryPanel } from "@/components/molecules/story-panel";
import type { Locale } from "@/lib/i18n";

type ProjectOutroProps = {
  locale: Locale;
  /** The project to read next; `null` when this is the only one. */
  next: { slug: string; title: string } | null;
  labels: { next: string; contact: string; cv: string };
  cvHref: string | null;
};

const PILL =
  "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-6 no-underline transition-colors hover:border-accent";

/** Last panel of a story: where to go from here, so the story never ends on empty paper. */
export function ProjectOutro({ locale, next, labels, cvHref }: ProjectOutroProps) {
  return (
    <StoryPanel className="pb-24 lg:pb-0">
      <div data-story-rise className="flex flex-col gap-10">
        {next && (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{labels.next}</p>
            <Link
              href={`/${locale}/projects/${next.slug}`}
              className="text-[clamp(2.25rem,5vw,4.5rem)] leading-none font-semibold tracking-tight no-underline"
            >
              <RiseText>{next.title}</RiseText>
            </Link>
          </div>
        )}
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link href={`/${locale}#contact`} className={PILL}>
              {labels.contact}
            </Link>
          </li>
          {cvHref && (
            <li>
              <Link href={cvHref} download className={PILL}>
                {labels.cv}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </StoryPanel>
  );
}
