import { Schema } from "effect";
import { BlockStructure, blocksTextSchema, type ResolvedBlock } from "./blocks";

const NonEmpty = Schema.String.check(Schema.isNonEmpty());

/** Language-independent shape of a tech watch note. */
export const NoteStructure = Schema.Struct({
  slug: Schema.String.check(Schema.isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  date: Schema.String.check(Schema.isPattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)),
  tags: Schema.NonEmptyArray(NonEmpty),
  blocks: Schema.NonEmptyArray(BlockStructure),
});
export type NoteStructure = typeof NoteStructure.Type;

/** Schema a locale file must satisfy for a given note. */
export function noteTextSchema(note: NoteStructure) {
  return Schema.Struct({
    title: NonEmpty,
    summary: NonEmpty,
    blocks: blocksTextSchema(note.blocks),
  });
}

/** A note resolved for one locale. */
export type Note = Omit<NoteStructure, "blocks"> & {
  title: string;
  summary: string;
  blocks: readonly ResolvedBlock[];
};
