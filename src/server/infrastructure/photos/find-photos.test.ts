import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findPhotos } from "./find-photos";

describe("findPhotos", () => {
  it("lists the pictures of a folder in name order and skips other files", () => {
    const root = mkdtempSync(path.join(tmpdir(), "photos-"));
    mkdirSync(path.join(root, "hero"));
    for (const name of ["b.jpg", "a.WEBP", "notes.txt"]) {
      writeFileSync(path.join(root, "hero", name), "");
    }

    expect(findPhotos("hero", root)).toEqual(["/photos/me/hero/a.WEBP", "/photos/me/hero/b.jpg"]);
  });

  it("returns nothing when the folder does not exist", () => {
    expect(findPhotos("trail", path.join(tmpdir(), "no-such-photos-directory"))).toEqual([]);
  });
});
