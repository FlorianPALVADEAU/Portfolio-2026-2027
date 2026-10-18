import { Effect, Schema } from "effect";
import {
  ContentError,
  type Project,
  ProjectStructure,
  projectTextSchema,
} from "@/server/domain/content";
import { ContentSource } from "./content-source";

/** Reads, validates and resolves one project for one locale. Any gap becomes a `ContentError`. */
export const loadProject = (slug: string, locale: string) =>
  Effect.gen(function* () {
    const source = yield* ContentSource;
    const fail = (reason: string) => new ContentError({ slug, locale, reason });

    const structure = yield* source.readStructure(slug).pipe(
      Effect.flatMap(Schema.decodeUnknownEffect(ProjectStructure)),
      Effect.mapError((error) =>
        error instanceof ContentError ? error : fail(`structure: ${error.message}`),
      ),
    );
    if (structure.slug !== slug) return yield* fail(`structure slug is "${structure.slug}"`);

    const text = yield* source.readText(slug, locale).pipe(
      Effect.flatMap(Schema.decodeUnknownEffect(projectTextSchema(structure))),
      Effect.mapError((error) =>
        error instanceof ContentError ? error : fail(`text: ${error.message}`),
      ),
    );

    const media = [
      structure.cover.src,
      ...structure.blocks.flatMap((b) => (b.type === "media" ? [b.image.src] : [])),
    ];
    for (const src of media) {
      if (!(yield* source.mediaExists(src))) return yield* fail(`missing media file ${src}`);
    }

    const blocks = structure.blocks.map((block) => ({ ...block, ...text.blocks[block.id] }));
    // Each block was validated against the text schema of its own type, so the merge is sound.
    return {
      ...structure,
      title: text.title,
      summary: text.summary,
      role: text.role,
      cover: { ...structure.cover, alt: text.alt },
      blocks,
    } as unknown as Project;
  });
