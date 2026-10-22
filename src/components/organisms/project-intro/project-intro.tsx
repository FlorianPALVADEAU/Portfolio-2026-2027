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

/** Opening panel of a project: the name, what it is, the facts and where to see it live. */
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
    <StoryPanel>
      <Entrance className="flex flex-col gap-8 py-24 lg:py-0">
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
        <Heading level={1} size="display" className="text-[clamp(3rem,9vw,8rem)] leading-none">
          {title}
        </Heading>
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Text data-entrance size="lg" className="max-w-prose">
            {summary}
          </Text>
          <dl data-entrance className="flex flex-col gap-5">
            {facts.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-widest text-accent">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {stack && (
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-widest text-accent">
                  {stack.title}
                </dt>
                <dd>
                  <ul className="flex flex-col">
                    {stack.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
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
      </Entrance>
    </StoryPanel>
  );
}
