import { Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { ContentError } from "@/server/domain/content";
import { ContentSource } from "./content-source";
import { loadProject } from "./load-project";

const structure = {
  slug: "demo",
  year: 2026,
  stack: ["TypeScript"],
  cover: { src: "/cover.png", width: 1600, height: 900 },
  blocks: [
    { id: "intro", type: "text" },
    { id: "shot", type: "media", image: { src: "/shot.png", width: 800, height: 600 } },
  ],
};
const text = {
  title: "Demo",
  summary: "Summary",
  role: "Developer",
  alt: "Cover",
  blocks: { intro: { paragraphs: ["Hello"] }, shot: { alt: "Shot" } },
};

function run(overrides: {
  structure?: unknown;
  text?: unknown;
  media?: string[];
  missingLocale?: boolean;
}) {
  const media = overrides.media ?? ["/cover.png", "/shot.png"];
  const layer = Layer.succeed(ContentSource, {
    readStructure: () => Effect.succeed(overrides.structure ?? structure),
    readText: (slug, locale) =>
      overrides.missingLocale
        ? Effect.fail(new ContentError({ slug, locale, reason: "missing locale file" }))
        : Effect.succeed(overrides.text ?? text),
    mediaExists: (src) => Effect.succeed(media.includes(src)),
  });
  return Effect.runPromise(loadProject("demo", "en").pipe(Effect.provide(layer), Effect.flip));
}

const ok = (overrides: Parameters<typeof run>[0] = {}) => {
  const layer = Layer.succeed(ContentSource, {
    readStructure: () => Effect.succeed(overrides.structure ?? structure),
    readText: () => Effect.succeed(overrides.text ?? text),
    mediaExists: () => Effect.succeed(true),
  });
  return Effect.runPromise(loadProject("demo", "en").pipe(Effect.provide(layer)));
};

describe("loadProject", () => {
  it("merges structure and text into a resolved project", async () => {
    const project = await ok();

    expect(project.title).toBe("Demo");
    expect(project.cover.alt).toBe("Cover");
    expect(project.blocks[0]).toMatchObject({ type: "text", paragraphs: ["Hello"] });
    expect(project.blocks[1]).toMatchObject({ type: "media", alt: "Shot" });
  });

  it("fails when the locale file is missing", async () => {
    const error = await run({ missingLocale: true });
    expect(error.message).toContain("missing locale file");
  });

  it("fails when a block has no translation", async () => {
    const error = await run({ text: { ...text, blocks: { intro: text.blocks.intro } } });
    expect(error).toBeInstanceOf(ContentError);
    expect(error.message).toContain("text:");
  });

  it("fails when a referenced media file is missing", async () => {
    const error = await run({ media: ["/cover.png"] });
    expect(error.message).toContain("missing media file /shot.png");
  });

  it("fails when the structure is invalid", async () => {
    const error = await run({ structure: { ...structure, year: 1 } });
    expect(error.message).toContain("structure:");
  });

  it("fails when the structure slug differs from the requested one", async () => {
    const error = await run({ structure: { ...structure, slug: "other" } });
    expect(error.message).toContain('structure slug is "other"');
  });
});
