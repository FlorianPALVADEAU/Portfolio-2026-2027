import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { NoteStructure, noteTextSchema } from "./note";

const structure = {
  slug: "sample-note",
  date: "2026-10-18",
  tags: ["tooling"],
  blocks: [{ id: "body", type: "text" }],
};

describe("NoteStructure", () => {
  it("accepts a valid note", () => {
    expect(Schema.decodeUnknownSync(NoteStructure)(structure).date).toBe("2026-10-18");
  });

  it.each([
    ["a malformed date", { ...structure, date: "18/10/2026" }],
    ["an impossible month", { ...structure, date: "2026-13-01" }],
    ["no tags", { ...structure, tags: [] }],
    ["a bad slug", { ...structure, slug: "Bad Slug" }],
  ])("rejects %s", (_, input) => {
    expect(() => Schema.decodeUnknownSync(NoteStructure)(input)).toThrow();
  });
});

describe("noteTextSchema", () => {
  const decode = Schema.decodeUnknownSync(
    noteTextSchema(Schema.decodeUnknownSync(NoteStructure)(structure)),
  );

  it("requires text for every block", () => {
    const valid = { title: "T", summary: "S", blocks: { body: { paragraphs: ["x"] } } };
    expect(decode(valid).title).toBe("T");
    expect(() => decode({ ...valid, blocks: {} })).toThrow();
  });
});
