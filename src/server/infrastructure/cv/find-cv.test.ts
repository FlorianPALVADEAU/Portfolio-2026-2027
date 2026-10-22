import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cvRelativePath, findCv } from "./find-cv";

describe("findCv", () => {
  it("keeps one folder per language and the same file name in each", () => {
    expect(cvRelativePath("fr")).toBe("fr/Florian_PALVADEAU_CV.pdf");
    expect(cvRelativePath("de")).toBe("de/Florian_PALVADEAU_CV.pdf");
  });

  it("returns the public URL of the files that exist and null for the others", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "cv-"));
    mkdirSync(path.join(directory, "en"));
    writeFileSync(path.join(directory, cvRelativePath("en")), "%PDF");

    expect(findCv("en", directory)).toBe("/cv/en/Florian_PALVADEAU_CV.pdf");
    expect(findCv("fr", directory)).toBeNull();
  });

  it("returns null when the directory does not exist", () => {
    expect(findCv("en", path.join(tmpdir(), "no-such-cv-directory"))).toBeNull();
  });
});
