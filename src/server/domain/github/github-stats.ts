import { Data, Schema } from "effect";

/** The fields of a public repository that the figures are built from. */
export const Repository = Schema.Struct({
  fork: Schema.Boolean,
  stargazers_count: Schema.Number,
  pushed_at: Schema.NullOr(Schema.String),
});
export type Repository = typeof Repository.Type;

/** Figures about the owner's own public work; forks are not counted as work. */
export type GithubStats = {
  repositories: number;
  stars: number;
  /** ISO date of the most recent push, or null when there is none. */
  lastPush: string | null;
};

/** The GitHub API could not be reached or answered something unexpected. */
export class GithubUnavailable extends Data.TaggedError("GithubUnavailable")<{
  reason: string;
}> {}

export function summarise(repositories: readonly Repository[]): GithubStats {
  const own = repositories.filter((repository) => !repository.fork);
  const pushes = own.flatMap(({ pushed_at }) => (pushed_at ? [pushed_at] : []));
  return {
    repositories: own.length,
    stars: own.reduce((total, { stargazers_count }) => total + stargazers_count, 0),
    lastPush: pushes.length > 0 ? pushes.reduce((a, b) => (a > b ? a : b)) : null,
  };
}
