import { Schema } from "effect";

const NonEmpty = Schema.String.check(Schema.isNonEmpty());
const BlockId = NonEmpty;

/** Image placed by structure; the alt text is translated, so it lives in the locale file. */
const Image = Schema.Struct({
  src: NonEmpty,
  width: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
  height: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)),
});

export const BlockStructure = Schema.Union([
  Schema.Struct({ id: BlockId, type: Schema.Literal("text") }),
  Schema.Struct({ id: BlockId, type: Schema.Literal("stack"), items: Schema.Array(NonEmpty) }),
  Schema.Struct({ id: BlockId, type: Schema.Literal("challenges") }),
  Schema.Struct({ id: BlockId, type: Schema.Literal("results") }),
  Schema.Struct({ id: BlockId, type: Schema.Literal("media"), image: Image }),
  Schema.Struct({
    id: BlockId,
    type: Schema.Literal("links"),
    items: Schema.Array(Schema.Struct({ id: BlockId, href: NonEmpty })),
  }),
]);
export type BlockStructure = typeof BlockStructure.Type;
type BlockType = BlockStructure["type"];

const blockTexts = {
  text: Schema.Struct({
    title: Schema.optional(NonEmpty),
    paragraphs: Schema.NonEmptyArray(NonEmpty),
  }),
  stack: Schema.Struct({ title: NonEmpty }),
  challenges: Schema.Struct({
    title: NonEmpty,
    items: Schema.NonEmptyArray(Schema.Struct({ title: NonEmpty, body: NonEmpty })),
  }),
  results: Schema.Struct({
    title: NonEmpty,
    items: Schema.NonEmptyArray(Schema.Struct({ label: NonEmpty, value: NonEmpty })),
  }),
  media: Schema.Struct({ alt: NonEmpty, caption: Schema.optional(NonEmpty) }),
  links: Schema.Struct({ title: NonEmpty, labels: Schema.Record(Schema.String, NonEmpty) }),
} as const satisfies Record<BlockType, Schema.Top>;

/** Text schema for one block, chosen by its structural type. */
export function blockTextSchema(block: BlockStructure) {
  return blockTexts[block.type];
}

/** A block with its locale text merged in, ready for rendering. */
export type ResolvedBlock = BlockStructure extends infer Structure
  ? Structure extends { type: infer Type extends BlockType }
    ? Structure & Schema.Schema.Type<(typeof blockTexts)[Type]>
    : never
  : never;
