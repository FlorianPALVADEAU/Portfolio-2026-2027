import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { GithubUnavailable, type Repository } from "@/server/domain/github";
import { GithubSource } from "./github-source";
import { loadGithubStats } from "./load-github-stats";

const run = (source: Effect.Effect<readonly Repository[], GithubUnavailable>) =>
  Effect.runPromiseExit(
    loadGithubStats.pipe(
      Effect.provide(Layer.succeed(GithubSource, { repositories: () => source })),
    ),
  );

const repo = (stars: number, pushed: string | null, fork = false): Repository => ({
  fork,
  stargazers_count: stars,
  pushed_at: pushed,
});

describe("loadGithubStats", () => {
  it("counts own repositories, sums their stars and finds the latest push", async () => {
    const exit = await run(
      Effect.succeed([
        repo(3, "2026-03-01T10:00:00Z"),
        repo(2, "2026-09-12T08:30:00Z"),
        repo(40, "2026-10-01T00:00:00Z", true),
        repo(0, null),
      ]),
    );

    expect(exit._tag).toBe("Success");
    if (exit._tag === "Success") {
      expect(exit.value).toEqual({
        repositories: 3,
        stars: 5,
        lastPush: "2026-09-12T08:30:00Z",
      });
    }
  });

  it("has no last push when nothing was ever pushed", async () => {
    const exit = await run(Effect.succeed([repo(0, null)]));

    expect(exit._tag === "Success" && exit.value.lastPush).toBeNull();
  });

  it("fails when GitHub is unavailable", async () => {
    const exit = await run(Effect.fail(new GithubUnavailable({ reason: "down" })));

    expect(exit._tag).toBe("Failure");
  });
});
