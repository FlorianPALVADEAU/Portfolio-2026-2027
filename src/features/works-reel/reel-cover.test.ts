import { describe, expect, it } from "vitest";
import { coverRatio } from "./reel-cover";

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
