import { Effect } from "effect";
import { GithubUnavailable } from "@/server/domain/github";
import { GithubSource } from "./github-source";

/** A history with no week in it cannot be drawn, so it counts as unavailable. */
export const loadGithubActivity = Effect.gen(function* () {
  const activity = yield* (yield* GithubSource).activity();
  if (activity.weeks.length === 0) {
    return yield* new GithubUnavailable({ reason: "empty contribution calendar" });
  }
  return activity;
});
