import { Effect } from "effect";
import { summarise } from "@/server/domain/github";
import { GithubSource } from "./github-source";

export const loadGithubStats = Effect.gen(function* () {
  const source = yield* GithubSource;
  return summarise(yield* source.repositories());
});
