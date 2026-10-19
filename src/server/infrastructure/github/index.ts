import { Effect } from "effect";
import { cacheLife } from "next/cache";
import { githubLogin } from "@/lib/landing";
import type { GithubActivity } from "@/server/domain/github";
import { loadGithubActivity } from "@/server/services/github";
import { GithubSourceLive } from "./github-source-live";

/** The last year of contributions, refreshed hourly; null when it cannot be read. */
export async function githubActivity(): Promise<GithubActivity | null> {
  "use cache";
  cacheLife("hours");
  return Effect.runPromise(
    loadGithubActivity.pipe(
      Effect.provide(GithubSourceLive(githubLogin)),
      Effect.tapError((error) => Effect.logWarning(`github: ${error.reason}`)),
      Effect.orElseSucceed(() => null),
    ),
  );
}
