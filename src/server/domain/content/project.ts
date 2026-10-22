import { Schema } from "effect";
import { BlockStructure, blocksTextSchema, type ResolvedBlock } from "./blocks";

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
    /** Grayscale depth map of the cover, same framing, white is near. Enables the hover parallax. */
    depth: Schema.optionalKey(NonEmpty),
  }),
  /** The opening picture of the story; with `video`, a player that opens on this picture. */
  teaser: Schema.optionalKey(
    Schema.Struct({
      poster: Schema.Struct({
        src: NonEmpty,
        width: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
        height: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
      }),
      video: Schema.optionalKey(NonEmpty),
    }),
  ),
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
    /** Alt text of the teaser picture, and name of its video; required when there is a teaser. */
    teaser: Schema.optionalKey(Schema.Struct({ label: NonEmpty })),
    blocks: blocksTextSchema(project.blocks),
  });
}

/** A project resolved for one locale: structure and translated text merged. */
export type Project = Omit<ProjectStructure, "blocks" | "cover" | "teaser"> & {
  teaser?: NonNullable<ProjectStructure["teaser"]> & { label: string };
  title: string;
  summary: string;
  role: string;
  cover: ProjectStructure["cover"] & { alt: string };
  blocks: readonly ResolvedBlock[];
};
