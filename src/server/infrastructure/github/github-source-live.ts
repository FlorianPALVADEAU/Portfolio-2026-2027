import { Effect, Layer, Schema } from "effect";
import { ContributionCalendar, GithubUnavailable, toActivity } from "@/server/domain/github";
import { GithubSource } from "@/server/services/github";

const ENDPOINT = "https://api.github.com/graphql";

// The contribution calendar exists only in the GraphQL API, which always asks for a token.
const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

const Reply = Schema.Struct({
  data: Schema.Struct({
    user: Schema.Struct({
      contributionsCollection: Schema.Struct({ contributionCalendar: ContributionCalendar }),
    }),
  }),
});

const fail = (reason: string) => new GithubUnavailable({ reason });

export const GithubSourceLive = (login: string) =>
  Layer.succeed(GithubSource, {
    activity: () =>
      Effect.gen(function* () {
        const token = process.env.GITHUB_TOKEN;
        if (!token) return yield* fail("GITHUB_TOKEN is not set");

        const json = yield* Effect.tryPromise({
          try: async () => {
            const reply = await fetch(ENDPOINT, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "portfolio",
              },
              body: JSON.stringify({ query: QUERY, variables: { login } }),
              signal: AbortSignal.timeout(10_000),
            });
            if (!reply.ok) throw new Error(`github ${reply.status}`);
            return reply.json();
          },
          catch: (error) => fail(String(error)),
        });
        const decoded = yield* Schema.decodeUnknownEffect(Reply)(json).pipe(
          Effect.mapError(() => fail("unexpected response")),
        );
        return toActivity(decoded.data.user.contributionsCollection.contributionCalendar);
      }),
  });
