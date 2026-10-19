import { describe, expect, it } from "vitest";
import { certifications, skillGroups } from "./skills";

describe("skills content", () => {
  it("has unique skills inside each group", () => {
    for (const { items } of skillGroups) {
      expect(new Set(items).size).toBe(items?.length ?? 0);
    }
  });

  it("publishes the owner-confirmed credentials only", () => {
    expect(certifications.map(({ id }) => id)).toEqual(["ckad", "psm", "aws"]);
  });
});
