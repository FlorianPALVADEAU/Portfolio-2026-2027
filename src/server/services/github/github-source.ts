import { Context, type Effect } from "effect";
import type { GithubUnavailable, Repository } from "@/server/domain/github";

/** Where the owner's public repositories come from. Infrastructure provides the API client. */
export class GithubSource extends Context.Service<
  GithubSource,
  { readonly repositories: () => Effect.Effect<readonly Repository[], GithubUnavailable> }
>()("GithubSource") {}
