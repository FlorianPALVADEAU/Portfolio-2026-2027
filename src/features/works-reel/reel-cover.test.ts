import { describe, expect, it } from "vitest";
import { coverRatio, sharpSource } from "./reel-cover";

describe("coverRatio", () => {
  it("crops the sides of a picture wider than its box", () => {
    expect(coverRatio(2, 1)).toEqual([0.5, 1]);
  });

  it("crops the top and bottom of a picture taller than its box", () => {
    expect(coverRatio(1, 2)).toEqual([1, 0.5]);
  });

  it("shows a picture that already fits in full", () => {
    expect(coverRatio(16 / 9, 16 / 9)).toEqual([1, 1]);
  });
});

describe("sharpSource", () => {
  it("asks the optimiser for the widest size", () => {
    expect(sharpSource("http://x.test/_next/image?url=%2Fa.webp&w=640&q=75", "http://x.test")).toBe(
      "/_next/image?url=%2Fa.webp&w=1920&q=75",
    );
  });

  it("keeps a source that is not optimised", () => {
    expect(sharpSource("/a.webp", "http://x.test")).toBe("/a.webp");
  });
});
