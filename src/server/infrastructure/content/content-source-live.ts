import { access } from "node:fs/promises";
import path from "node:path";
import { Effect, Layer } from "effect";
import { ContentError } from "@/server/domain/content";
import { type ContentKind, ContentSource } from "@/server/services/content";
import { registry } from "../../../../content/registry";

type Entry = {
  structure: () => Promise<{ default: unknown }>;
  text: Readonly<Record<string, () => Promise<{ default: unknown }>>>;
};

export const slugsOf = (kind: ContentKind): readonly string[] => Object.keys(registry[kind]);

const entryFor = (kind: ContentKind, slug: string): Effect.Effect<Entry, ContentError> => {
  const entries: Readonly<Record<string, Entry>> = registry[kind];
  const entry = entries[slug];
  return entry
    ? Effect.succeed(entry)
    : Effect.fail(new ContentError({ slug, reason: `unknown ${kind}` }));
};

export const ContentSourceLive = Layer.succeed(ContentSource, {
  readStructure: (kind, slug) =>
    entryFor(kind, slug).pipe(
      Effect.flatMap((entry) =>
        Effect.tryPromise({
          try: async () => (await entry.structure()).default,
          catch: () => new ContentError({ slug, reason: `cannot read ${kind} structure` }),
        }),
      ),
    ),
  readText: (kind, slug, locale) =>
    entryFor(kind, slug).pipe(
      Effect.flatMap((entry) => {
        const load = entry.text[locale];
        if (!load) {
          return Effect.fail(new ContentError({ slug, locale, reason: "missing locale file" }));
        }
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
