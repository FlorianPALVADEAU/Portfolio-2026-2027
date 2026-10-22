import { Effect, Schema } from "effect";
import {
  blockMedia,
  type Project,
  ProjectStructure,
  projectTextSchema,
  resolveBlocks,
} from "@/server/domain/content";
import { loadEntry } from "./load-entry";

/** Reads, validates and resolves one project for one locale. */
export const loadProject = (slug: string, locale: string) =>
  loadEntry({
    kind: "project",
    slug,
    locale,
    decodeStructure: Schema.decodeUnknownEffect(ProjectStructure),
    decodeText: (structure: ProjectStructure, input) =>
      Schema.decodeUnknownEffect(projectTextSchema(structure))(input),
    media: (structure: ProjectStructure) => [
      structure.cover.src,
      ...(structure.cover.depth ? [structure.cover.depth] : []),
      ...blockMedia(structure.blocks),
    ],
  }).pipe(
    Effect.map(
      ({ structure, text }): Project => ({
        ...structure,
        title: text.title,
        summary: text.summary,
        role: text.role,
        cover: { ...structure.cover, alt: text.alt },
        blocks: resolveBlocks(structure.blocks, text.blocks),
      }),
    ),
  );
