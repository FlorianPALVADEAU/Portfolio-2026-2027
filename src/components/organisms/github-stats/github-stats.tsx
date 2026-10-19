import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import type { Locale, Messages } from "@/lib/i18n";

type GithubStatsProps = {
  locale: Locale;
  messages: Messages["home"]["contact"]["github"];
  /** Real figures from the GitHub API; null when it could not be reached. */
  stats: { repositories: number; stars: number; lastPush: string | null } | null;
};

type Stats = NonNullable<GithubStatsProps["stats"]>;
type Figure = { label: string; value: string };

/** Zero is not a figure worth showing; a missing value is simply left out. */
function figures(locale: Locale, messages: GithubStatsProps["messages"], stats: Stats): Figure[] {
  const number = new Intl.NumberFormat(locale);
  const month = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const items: Figure[] = [];
  if (stats.repositories > 0) {
    items.push({ label: messages.repositories, value: number.format(stats.repositories) });
  }
  if (stats.stars > 0) items.push({ label: messages.stars, value: number.format(stats.stars) });
  if (stats.lastPush) {
    items.push({ label: messages.lastPush, value: month.format(new Date(stats.lastPush)) });
  }
  return items;
}

export function GithubStats({ locale, messages, stats }: GithubStatsProps) {
  if (!stats) return null;
  const items = figures(locale, messages, stats);
  if (items.length === 0) return null;

  return (
    <div className="mt-24 grid gap-10 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-5">
        <Heading level={3} size="xl">
          {messages.title}
        </Heading>
        <Text tone="muted" size="sm" className="max-w-[40ch]">
          {messages.note}
        </Text>
      </div>
      <dl className="grid gap-8 sm:grid-cols-3 md:col-span-6 md:col-start-7">
        {items.map(({ label, value }) => (
          <div key={label} className="flex flex-col-reverse gap-1">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
