import { describe, expect, it } from "vitest";
import { extendTrail, pruneTrail, trailStrength } from "./trail";

const LIFETIME = 100;

describe("extendTrail", () => {
  it("appends a point that moved and drops the expired ones", () => {
    const points = [
      { x: 0, y: 0, time: 0 },
      { x: 10, y: 0, time: 90 },
    ];

    expect(extendTrail(points, { x: 20, y: 0, time: 120 }, LIFETIME)).toEqual([
      { x: 10, y: 0, time: 90 },
      { x: 20, y: 0, time: 120 },
    ]);
  });

  it("ignores a point that barely moved", () => {
    const points = [{ x: 0, y: 0, time: 0 }];

    expect(extendTrail(points, { x: 0.5, y: 0.5, time: 10 }, LIFETIME)).toEqual(points);
  });
});

describe("pruneTrail", () => {
  it("empties once everything is older than the lifetime", () => {
    expect(pruneTrail([{ x: 0, y: 0, time: 0 }], 100, LIFETIME)).toEqual([]);
  });
});

describe("trailStrength", () => {
  it.each([
    [0, 1],
    [50, 0.5],
    [100, 0],
    [250, 0],
  ])("is %s ms old, so %s strong", (age, strength) => {
    expect(trailStrength({ x: 0, y: 0, time: 0 }, age, LIFETIME)).toBeCloseTo(strength);
  });
});
