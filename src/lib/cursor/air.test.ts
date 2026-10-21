import { describe, expect, it } from "vitest";
import { stepSpring, streakLength, streakStrength, swingAngle } from "./air";

describe("swingAngle", () => {
  it("leans with the speed and the way it goes", () => {
    expect(swingAngle(1000)).toBeCloseTo(14);
    expect(swingAngle(-1000)).toBeCloseTo(-14);
    expect(swingAngle(0)).toBe(0);
  });

  it("never leans past the limit", () => {
    expect(swingAngle(90000)).toBe(24);
    expect(swingAngle(-90000)).toBe(-24);
  });
});

describe("streakStrength", () => {
  it.each([
    [0, 0],
    [380, 0],
    [1700, 1],
    [9000, 1],
  ])("is %s px/s, so %s strong", (speed, strength) => {
    expect(streakStrength(speed)).toBe(strength);
  });

  it("scales the length with the strength", () => {
    expect(streakLength(0)).toBe(0);
    expect(streakLength(1)).toBeGreaterThan(streakLength(0.5));
  });
});

describe("stepSpring", () => {
  it("settles on its target", () => {
    let spring = { value: 20, velocity: 0 };
    for (let i = 0; i < 240; i++) spring = stepSpring(spring, 0, 1 / 60);

    expect(spring.value).toBeCloseTo(0, 2);
    expect(spring.velocity).toBeCloseTo(0, 2);
  });

  it("overshoots before it settles", () => {
    let spring = { value: 20, velocity: 0 };
    let lowest = 20;
    for (let i = 0; i < 120; i++) {
      spring = stepSpring(spring, 0, 1 / 60);
      lowest = Math.min(lowest, spring.value);
    }

    expect(lowest).toBeLessThan(0);
  });
});
