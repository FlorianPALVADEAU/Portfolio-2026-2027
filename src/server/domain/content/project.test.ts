import { Schema } from "effect";
import { describe, expect, it } from "vitest";
import { ProjectStructure, projectTextSchema } from "./project";

const structure = {
  slug: "sample-project",
  year: 2025,
  stack: ["TypeScript"],
  cover: { src: "/projects/sample/cover.jpg", width: 1600, height: 900 },
  blocks: [
    { id: "intro", type: "text" },
    {
      id: "shot",
      type: "media",
      image: { src: "/projects/sample/shot.jpg", width: 800, height: 600 },
    },
  ],
} as const;

const text = {
  title: "Sample",
  summary: "A sample project",
  role: "Developer",
  alt: "Cover",
  blocks: {
    intro: { paragraphs: ["Hello"] },
    shot: { alt: "Screenshot" },
  },
};

describe("ProjectStructure", () => {
  it("accepts a valid structure", () => {
    expect(Schema.decodeUnknownSync(ProjectStructure)(structure).slug).toBe("sample-project");
  });

  it.each([
    ["a bad slug", { ...structure, slug: "Not A Slug" }],
    ["an unknown block type", { ...structure, blocks: [{ id: "x", type: "video" }] }],
    ["no blocks", { ...structure, blocks: [] }],
    ["a non positive image size", { ...structure, cover: { ...structure.cover, width: 0 } }],
  ])("rejects %s", (_, input) => {
    expect(() => Schema.decodeUnknownSync(ProjectStructure)(input)).toThrow();
  });
});

describe("projectTextSchema", () => {
  const schema = Schema.decodeUnknownSync(
    projectTextSchema(Schema.decodeUnknownSync(ProjectStructure)(structure)),
  );

  it("accepts text covering every block", () => {
    expect(schema(text).title).toBe("Sample");
  });

  it("rejects text missing a block", () => {
    expect(() => schema({ ...text, blocks: { intro: text.blocks.intro } })).toThrow();
  });

  it("rejects text with the wrong shape for a block type", () => {
    expect(() =>
      schema({ ...text, blocks: { ...text.blocks, shot: { paragraphs: ["x"] } } }),
    ).toThrow();
  });

  it("rejects an empty translation", () => {
    expect(() => schema({ ...text, title: "" })).toThrow();
  });
});
