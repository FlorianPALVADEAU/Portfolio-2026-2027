import { Context, type Effect } from "effect";
import type { GithubActivity, GithubUnavailable } from "@/server/domain/github";

/** Where the owner's contribution history comes from. Infrastructure provides the API client. */
export class GithubSource extends Context.Service<
  GithubSource,
  { readonly activity: () => Effect.Effect<GithubActivity, GithubUnavailable> }
>()("GithubSource") {}
