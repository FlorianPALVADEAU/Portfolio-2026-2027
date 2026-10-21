import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import type { Locale, Messages } from "@/lib/i18n";

type Level = 0 | 1 | 2 | 3 | 4;

type GithubActivityProps = {
  locale: Locale;
  messages: Messages["home"]["contact"]["github"];
  /** The last year of contributions; null when GitHub could not be read. */
  activity: {
    total: number;
    weeks: readonly (readonly { date: string; count: number; level: Level }[])[];
  } | null;
};

/** One accent, four strengths: the same single-signal rule as the rest of the interface. */
const SHADES: Record<Level, string> = {
  0: "bg-muted",
  1: "bg-accent/25",
  2: "bg-accent/50",
  3: "bg-accent/75",
  4: "bg-accent",
};

/** GitHub weeks start on Sunday; the first and last week may be partial, so rows come from dates. */
const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

export function GithubActivity({ locale, messages, activity }: GithubActivityProps) {
  if (!activity) return null;

  return (
    <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-5">
        <Heading level={3} size="xl">
          {messages.title}
        </Heading>
        <Text tone="muted" size="sm" className="max-w-[40ch]">
          {messages.note}
        </Text>
      </div>
      <div className="flex flex-col gap-4 md:col-span-6 md:col-start-7">
        <p className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {new Intl.NumberFormat(locale).format(activity.total)}
          </span>
          <span className="text-sm text-muted-foreground">{messages.total}</span>
        </p>
        {/* The graph repeats the number above, so assistive technology skips the 371 cells. */}
        <div
          aria-hidden="true"
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${activity.weeks.length}, minmax(0, 1fr))` }}
        >
          {activity.weeks.flatMap((week, column) =>
            week.map(({ date, count, level }) => (
              <span
                key={date}
                title={`${date}: ${count}`}
                className={`aspect-square rounded-[2px] ${SHADES[level]}`}
                style={{ gridColumn: column + 1, gridRow: weekday(date) + 1 }}
              />
            )),
          )}
        </div>
        <p
          aria-hidden="true"
          className="flex items-center gap-2 self-end text-xs text-muted-foreground"
        >
          {messages.less}
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span key={level} className={`size-3 rounded-[2px] ${SHADES[level]}`} />
          ))}
          {messages.more}
        </p>
      </div>
    </div>
  );
}
