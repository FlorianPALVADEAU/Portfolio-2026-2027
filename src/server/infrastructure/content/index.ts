import { Effect } from "effect";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/server/domain/content";
import { loadProject as loadProjectEffect } from "@/server/services/content";
import { ContentSourceLive, slugs } from "./content-source-live";

export const projectSlugs: readonly string[] = slugs;

/** Plain-promise entry point for routes; rejects with a `ContentError` when content is invalid. */
export async function loadProject(slug: string, locale: Locale): Promise<Project> {
  // Reading files counts as runtime I/O under Cache Components; caching makes it build-time.
  "use cache";
  return Effect.runPromise(loadProjectEffect(slug, locale).pipe(Effect.provide(ContentSourceLive)));
}
