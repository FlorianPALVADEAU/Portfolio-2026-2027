import { access } from "node:fs/promises";
import path from "node:path";
import { Effect, Layer } from "effect";
import { ContentError } from "@/server/domain/content";
import { ContentSource } from "@/server/services/content";
import { registry } from "../../../../content/registry";

export const slugs = Object.keys(registry);

type Entry = (typeof registry)[keyof typeof registry];

const entryFor = (slug: string): Effect.Effect<Entry, ContentError> =>
  slug in registry
    ? Effect.succeed(registry[slug as keyof typeof registry])
    : Effect.fail(new ContentError({ slug, reason: "unknown project" }));

export const ContentSourceLive = Layer.succeed(ContentSource, {
  readStructure: (slug) =>
    entryFor(slug).pipe(
      Effect.flatMap((entry) =>
        Effect.tryPromise({
          try: async () => (await entry.structure()).default,
          catch: () => new ContentError({ slug, reason: "cannot read project.ts" }),
        }),
      ),
    ),
  readText: (slug, locale) =>
    entryFor(slug).pipe(
      Effect.flatMap((entry) => {
        const load = entry.text[locale as keyof typeof entry.text];
        if (!load)
          return Effect.fail(new ContentError({ slug, locale, reason: "missing locale file" }));
        return Effect.tryPromise({
          try: async () => (await load()).default,
          catch: () => new ContentError({ slug, locale, reason: "cannot read locale file" }),
        });
      }),
    ),
  mediaExists: (src) =>
    Effect.promise(() =>
      access(path.join(process.cwd(), "public", src)).then(
        () => true,
        () => false,
      ),
    ),
});
