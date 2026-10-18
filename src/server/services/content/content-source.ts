import { Context, type Effect } from "effect";
import type { ContentError } from "@/server/domain/content";

/** Where raw, unvalidated content comes from. Infrastructure provides the implementation. */
export class ContentSource extends Context.Service<
  ContentSource,
  {
    readonly readStructure: (slug: string) => Effect.Effect<unknown, ContentError>;
    readonly readText: (slug: string, locale: string) => Effect.Effect<unknown, ContentError>;
    readonly mediaExists: (src: string) => Effect.Effect<boolean>;
  }
>()("ContentSource") {}
