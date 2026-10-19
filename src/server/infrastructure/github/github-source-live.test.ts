import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GithubSource } from "@/server/services/github";
import { GithubSourceLive } from "./github-source-live";

const calendar = {
  totalContributions: 5,
  weeks: [
    {
      contributionDays: [
        { date: "2026-10-17", contributionCount: 0, contributionLevel: "NONE" },
        { date: "2026-10-18", contributionCount: 5, contributionLevel: "FOURTH_QUARTILE" },
      ],
    },
  ],
};

const answer = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 401, json: async () => body });

const activity = () =>
  Effect.runPromiseExit(
    Effect.gen(function* () {
      return yield* (yield* GithubSource).activity();
    }).pipe(Effect.provide(GithubSourceLive("someone"))),
  );

describe("GitHub source", () => {
  beforeEach(() => vi.stubEnv("GITHUB_TOKEN", "ghp_token"));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("asks GraphQL for the login and maps levels to numbers", async () => {
    const fetchMock = answer({
      data: { user: { contributionsCollection: { contributionCalendar: calendar } } },
    });
    vi.stubGlobal("fetch", fetchMock);

    const exit = await activity();

    expect(exit._tag === "Success" && exit.value).toEqual({
      total: 5,
      weeks: [
        [
          { date: "2026-10-17", count: 0, level: 0 },
          { date: "2026-10-18", count: 5, level: 4 },
        ],
      ],
    });
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://api.github.com/graphql");
    expect(init.headers.Authorization).toBe("Bearer ghp_token");
    expect(JSON.parse(init.body).variables).toEqual({ login: "someone" });
  });

  it("fails without calling GitHub when there is no token", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("GITHUB_TOKEN", "");

    expect((await activity())._tag).toBe("Failure");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails on an HTTP error and on a reply that is not a calendar", async () => {
    vi.stubGlobal("fetch", answer({}, false));
    expect((await activity())._tag).toBe("Failure");

    vi.stubGlobal("fetch", answer({ errors: [{ message: "Could not resolve to a User" }] }));
    expect((await activity())._tag).toBe("Failure");
  });
});
