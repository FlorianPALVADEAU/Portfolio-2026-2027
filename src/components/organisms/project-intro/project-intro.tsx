import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";
import { StoryPanel } from "@/components/molecules/story-panel";
import { Entrance } from "@/features/entrance";
import type { Locale } from "@/lib/i18n";

type ProjectIntroProps = {
  locale: Locale;
  title: string;
  summary: string;
  back: string;
  facts: readonly { label: string; value: string }[];
  stack: { title: string; items: readonly string[] } | null;
  links: readonly { id: string; href: string; label: string }[];
};

const LABEL = "font-mono text-xs uppercase tracking-widest text-accent";

/** Opening screen of a project: the way back on top, the name large below, the facts beside it. */
export function ProjectIntro({
  locale,
  title,
  summary,
  back,
  facts,
  stack,
  links,
}: ProjectIntroProps) {
  return (
    <StoryPanel size="intro">
      <Entrance className="flex flex-1 flex-col justify-between gap-16 py-8 lg:py-0">
        <div data-entrance>
          <Link
            href={`/${locale}`}
            data-restore-scroll=""
            data-keep-scroll=""
            data-no-cover=""
            className="inline-flex min-h-11 items-center"
          >
            {back}
          </Link>
        </div>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <Heading
            level={1}
            size="display"
            className="text-[clamp(3rem,7vw,7.5rem)] leading-[0.92] lg:col-span-7"
          >
            {title}
          </Heading>
          <div className="flex flex-col gap-8 lg:col-span-5 lg:pb-3">
            <Text data-entrance size="sm" className="max-w-[44ch] text-pretty leading-relaxed">
              {summary}
            </Text>
            <dl data-entrance className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
              {facts.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className={LABEL}>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              {stack && (
                <div className="col-span-2 flex flex-col gap-1">
                  <dt className={LABEL}>{stack.title}</dt>
                  <dd>{stack.items.join(" · ")}</dd>
                </div>
              )}
            </dl>
            {links.length > 0 && (
              <ul data-entrance className="flex flex-wrap gap-3">
                {links.map(({ id, href, label }) => (
                  <li key={id}>
                    <Link
                      href={href}
                      external
                      className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-6 no-underline transition-colors hover:border-accent"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Entrance>
    </StoryPanel>
  );
}
