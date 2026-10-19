import { Effect } from "effect";
import { cacheLife } from "next/cache";
import { githubLogin } from "@/lib/landing";
import type { GithubStats } from "@/server/domain/github";
import { loadGithubStats } from "@/server/services/github";
import { GithubSourceLive } from "./github-source-live";

/** Figures from the public API, refreshed hourly; null when GitHub cannot be reached. */
export async function githubStats(): Promise<GithubStats | null> {
  "use cache";
  cacheLife("hours");
  return Effect.runPromise(
    loadGithubStats.pipe(
      Effect.provide(GithubSourceLive(githubLogin)),
      Effect.orElseSucceed(() => null),
    ),
  );
}
