import { Data, Schema } from "effect";

const Level = Schema.Literals([
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
]);

/** GitHub's `contributionCalendar`, the same data as the graph on the profile page. */
export const ContributionCalendar = Schema.Struct({
  totalContributions: Schema.Number,
  weeks: Schema.Array(
    Schema.Struct({
      contributionDays: Schema.Array(
        Schema.Struct({
          date: Schema.String,
          contributionCount: Schema.Number,
          contributionLevel: Level,
        }),
      ),
    }),
  ),
});

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

/** The last year of contributions, ready to draw: one column per week, one cell per day. */
export type GithubActivity = {
  total: number;
  weeks: readonly (readonly { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[])[];
};

export function toActivity(calendar: typeof ContributionCalendar.Type): GithubActivity {
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map(({ contributionDays }) =>
      contributionDays.map(({ date, contributionCount, contributionLevel }) => ({
        date,
        count: contributionCount,
        level: LEVELS[contributionLevel],
      })),
    ),
  };
}

/** The GitHub API is not configured, cannot be reached or answered something unexpected. */
export class GithubUnavailable extends Data.TaggedError("GithubUnavailable")<{
  reason: string;
}> {}
