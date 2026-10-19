import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cvFileName, findCv } from "./find-cv";

describe("findCv", () => {
  it("names one file per language", () => {
    expect(cvFileName("fr")).toBe("cv-fr.pdf");
    expect(cvFileName("de")).toBe("cv-de.pdf");
  });

  it("returns the public URL of the files that exist and null for the others", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "cv-"));
    writeFileSync(path.join(directory, "cv-en.pdf"), "%PDF");

    expect(findCv("en", directory)).toBe("/cv/cv-en.pdf");
    expect(findCv("fr", directory)).toBeNull();
  });

  it("returns null when the directory does not exist", () => {
    expect(findCv("en", path.join(tmpdir(), "no-such-cv-directory"))).toBeNull();
  });
});
