import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { type GithubActivity, GithubUnavailable } from "@/server/domain/github";
import { GithubSource } from "./github-source";
import { loadGithubActivity } from "./load-github-activity";

const run = (source: Effect.Effect<GithubActivity, GithubUnavailable>) =>
  Effect.runPromiseExit(
    loadGithubActivity.pipe(
      Effect.provide(Layer.succeed(GithubSource, { activity: () => source })),
    ),
  );

const activity: GithubActivity = {
  total: 3,
  weeks: [[{ date: "2026-10-18", count: 3, level: 2 }]],
};

describe("loadGithubActivity", () => {
  it("returns the activity from the source", async () => {
    const exit = await run(Effect.succeed(activity));

    expect(exit._tag === "Success" && exit.value).toEqual(activity);
  });

  it("treats an empty calendar as unavailable", async () => {
    const exit = await run(Effect.succeed({ total: 0, weeks: [] }));

    expect(exit._tag).toBe("Failure");
  });

  it("fails when GitHub is unavailable", async () => {
    const exit = await run(Effect.fail(new GithubUnavailable({ reason: "down" })));

    expect(exit._tag).toBe("Failure");
  });
});
