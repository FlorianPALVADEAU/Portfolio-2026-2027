import { Effect, Layer, Schema } from "effect";
import { GithubUnavailable, Repository } from "@/server/domain/github";
import { GithubSource } from "@/server/services/github";

const fail = (reason: string) => new GithubUnavailable({ reason });

export const GithubSourceLive = (login: string) =>
  Layer.succeed(GithubSource, {
    repositories: () =>
      Effect.gen(function* () {
        // A token only raises the rate limit; the public data is the same without it.
        const token = process.env.GITHUB_TOKEN;
        const json = yield* Effect.tryPromise({
          try: async () => {
            const reply = await fetch(
              `https://api.github.com/users/${login}/repos?type=owner&per_page=100`,
              {
                headers: {
                  Accept: "application/vnd.github+json",
                  "User-Agent": "portfolio",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                signal: AbortSignal.timeout(10_000),
              },
            );
            if (!reply.ok) throw new Error(`github ${reply.status}`);
            return reply.json();
          },
          catch: (error) => fail(String(error)),
        });
        return yield* Schema.decodeUnknownEffect(Schema.Array(Repository))(json).pipe(
          Effect.mapError(() => fail("unexpected response")),
        );
      }),
  });
