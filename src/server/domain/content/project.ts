import { Schema } from "effect";
import { BlockStructure, blockTextSchema } from "./blocks";

const NonEmpty = Schema.String.check(Schema.isNonEmpty());

/** Language-independent shape of a project: facts, media and the ordered block list. */
export const ProjectStructure = Schema.Struct({
  slug: Schema.String.check(Schema.isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  year: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 2000, maximum: 2100 })),
  stack: Schema.NonEmptyArray(NonEmpty),
  cover: Schema.Struct({
    src: NonEmpty,
    width: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
    height: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
  }),
  blocks: Schema.NonEmptyArray(BlockStructure),
});
export type ProjectStructure = typeof ProjectStructure.Type;

/**
 * Builds the schema a locale file must satisfy for a given project: one text entry per
 * block id, shaped by that block's type. A missing or malformed translation fails decoding.
 */
export function projectTextSchema(project: ProjectStructure) {
  return Schema.Struct({
    title: NonEmpty,
    summary: NonEmpty,
    role: NonEmpty,
    alt: NonEmpty,
    blocks: Schema.Struct(
      Object.fromEntries(project.blocks.map((block) => [block.id, blockTextSchema(block)])),
    ),
  });
}
