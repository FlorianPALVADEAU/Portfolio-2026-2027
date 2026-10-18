import { Effect } from "effect";
import type { Locale } from "@/lib/i18n";
import type { Note, Project } from "@/server/domain/content";
import {
  loadNote as loadNoteEffect,
  loadProject as loadProjectEffect,
} from "@/server/services/content";
import { ContentSourceLive, slugsOf } from "./content-source-live";

export const projectSlugs = slugsOf("project");
export const noteSlugs = slugsOf("note");

// Reading files counts as runtime I/O under Cache Components; "use cache" makes it build-time.

/** Plain-promise entry point for routes; rejects with a `ContentError` when content is invalid. */
export async function loadProject(slug: string, locale: Locale): Promise<Project> {
  "use cache";
  return Effect.runPromise(loadProjectEffect(slug, locale).pipe(Effect.provide(ContentSourceLive)));
}

export async function loadNote(slug: string, locale: Locale): Promise<Note> {
  "use cache";
  return Effect.runPromise(loadNoteEffect(slug, locale).pipe(Effect.provide(ContentSourceLive)));
}
