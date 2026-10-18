import { Effect } from "effect";
import { ContentError } from "@/server/domain/content";
import { type ContentKind, ContentSource } from "./content-source";

type Failure = { readonly message: string };

type EntryDefinition<Structure extends { slug: string }, Text> = {
  kind: ContentKind;
  slug: string;
  locale: string;
  decodeStructure: (input: unknown) => Effect.Effect<Structure, Failure>;
  decodeText: (structure: Structure, input: unknown) => Effect.Effect<Text, Failure>;
  media: (structure: Structure) => readonly string[];
};

/** Shared pipeline: read, decode, check media. Any gap becomes a `ContentError`. */
export const loadEntry = <Structure extends { slug: string }, Text>(
  definition: EntryDefinition<Structure, Text>,
) =>
  Effect.gen(function* () {
    const { kind, slug, locale } = definition;
    const source = yield* ContentSource;
    const fail = (reason: string) => new ContentError({ slug, locale, reason });
    const toContentError = (step: string) => (error: ContentError | Failure) =>
      error instanceof ContentError ? error : fail(`${step}: ${error.message}`);

    const structure = yield* source
      .readStructure(kind, slug)
      .pipe(
        Effect.flatMap(definition.decodeStructure),
        Effect.mapError(toContentError("structure")),
      );
    if (structure.slug !== slug) return yield* fail(`structure slug is "${structure.slug}"`);

    const text = yield* source.readText(kind, slug, locale).pipe(
      Effect.flatMap((input) => definition.decodeText(structure, input)),
      Effect.mapError(toContentError("text")),
    );

    for (const src of definition.media(structure)) {
      if (!(yield* source.mediaExists(src))) return yield* fail(`missing media file ${src}`);
    }

    return { structure, text };
  });
