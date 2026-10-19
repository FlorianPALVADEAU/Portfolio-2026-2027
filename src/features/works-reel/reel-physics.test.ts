import { describe, expect, it } from "vitest";
import { followTarget, pinchTarget } from "./reel-physics";

describe("pinchTarget", () => {
  it("is still when the page is still", () => {
    expect(pinchTarget(0)).toBe(0);
  });

  it("ignores the scroll direction", () => {
    expect(pinchTarget(-900)).toBe(pinchTarget(900));
  });

  it("grows with speed but never passes 1", () => {
    expect(pinchTarget(600)).toBeLessThan(pinchTarget(1800));
    expect(pinchTarget(1e6)).toBeLessThanOrEqual(1);
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

  it("settles exactly on zero", () => {
    let value = 6;
    for (let frame = 0; frame < 240; frame += 1) value = followTarget(value, 0, 1 / 60);
    expect(value).toBe(0);
  });
});
