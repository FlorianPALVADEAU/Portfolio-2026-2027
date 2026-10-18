import { Effect, Schema } from "effect";
import {
  blockMedia,
  type Note,
  NoteStructure,
  noteTextSchema,
  resolveBlocks,
} from "@/server/domain/content";
import { loadEntry } from "./load-entry";

/** Reads, validates and resolves one note for one locale. */
export const loadNote = (slug: string, locale: string) =>
  loadEntry({
    kind: "note",
    slug,
    locale,
    decodeStructure: Schema.decodeUnknownEffect(NoteStructure),
    decodeText: (structure: NoteStructure, input) =>
      Schema.decodeUnknownEffect(noteTextSchema(structure))(input),
    media: (structure: NoteStructure) => blockMedia(structure.blocks),
  }).pipe(
    Effect.map(
      ({ structure, text }): Note => ({
        ...structure,
        title: text.title,
        summary: text.summary,
        blocks: resolveBlocks(structure.blocks, text.blocks),
      }),
    ),
  );
