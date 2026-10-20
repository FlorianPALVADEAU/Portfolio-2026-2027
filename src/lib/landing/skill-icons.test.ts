import { describe, expect, it } from "vitest";
import { skillIcon } from "./skill-icons";
import { skillGroups } from "./skills";

describe("skillIcon", () => {
  it("finds a logo for a technology and none for the rest", () => {
    expect(skillIcon("TypeScript")?.path).toMatch(/^M/);
    expect(skillIcon("Scrum")).toBeNull();
  });

  it("covers every labelled technology but the few without a public logo", () => {
    const labelled = skillGroups.flatMap(({ items }) => items ?? []);
    const missing = labelled.filter((label) => !skillIcon(label));
    expect(missing).toEqual(["BullMQ", "CI/CD"]);
  });
});
