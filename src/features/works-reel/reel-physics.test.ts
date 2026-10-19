import { describe, expect, it } from "vitest";
import { followTarget, skewTarget } from "./reel-physics";

describe("skewTarget", () => {
  it("is still when the page is still", () => {
    expect(skewTarget(0, 6)).toBe(0);
  });

  it("follows the scroll direction", () => {
    expect(skewTarget(900, 6)).toBeGreaterThan(0);
    expect(skewTarget(-900, 6)).toBeLessThan(0);
  });

  it("grows with speed but never passes the cap", () => {
    expect(skewTarget(600, 6)).toBeLessThan(skewTarget(1800, 6));
    expect(Math.abs(skewTarget(1e6, 6))).toBeLessThanOrEqual(6);
  });
});

describe("followTarget", () => {
  it("rises toward a faster target without overshooting", () => {
    let value = 0;
    for (let frame = 0; frame < 120; frame += 1) {
      value = followTarget(value, 5, 1 / 60);
      expect(value).toBeLessThanOrEqual(5);
    }
    expect(value).toBeGreaterThan(4.9);
  });

  it("falls slower than it rises", () => {
    const rise = followTarget(0, 5, 1 / 60);
    const fall = 5 - followTarget(5, 0, 1 / 60);
    expect(fall).toBeLessThan(rise);
  });

  it("gives the same result at 60 and 120 frames per second", () => {
    let slow = 3;
    let fast = 3;
    for (let frame = 0; frame < 30; frame += 1) slow = followTarget(slow, 0, 1 / 60);
    for (let frame = 0; frame < 60; frame += 1) fast = followTarget(fast, 0, 1 / 120);
    expect(fast).toBeCloseTo(slow, 6);
  });

  it("passes through zero when the direction flips", () => {
    let value = 4;
    const seen: number[] = [];
    for (let frame = 0; frame < 90; frame += 1) {
      value = followTarget(value, -4, 1 / 60);
      seen.push(value);
    }
    expect(seen.some((step) => Math.abs(step) < 0.5)).toBe(true);
    expect(seen.at(-1)).toBeLessThan(-3.9);
  });

  it("settles exactly on zero", () => {
    let value = 6;
    for (let frame = 0; frame < 240; frame += 1) value = followTarget(value, 0, 1 / 60);
    expect(value).toBe(0);
  });
});
