import { describe, expect, it } from "vitest";
import { damp, springStep, wanderGaze } from "./duck-motion";

describe("damp", () => {
  it("approaches the target and never overshoots", () => {
    let value = 0;
    for (let frame = 0; frame < 120; frame++) {
      value = damp(value, 1, 6, 1 / 60);
      expect(value).toBeLessThanOrEqual(1);
    }
    expect(value).toBeGreaterThan(0.99);
  });

  it("covers the same ground whatever the frame rate", () => {
    let slow = 0;
    let fast = 0;
    for (let frame = 0; frame < 30; frame++) slow = damp(slow, 1, 4, 1 / 30);
    for (let frame = 0; frame < 120; frame++) fast = damp(fast, 1, 4, 1 / 120);
    expect(slow).toBeCloseTo(fast, 5);
  });
});

describe("springStep", () => {
  it("settles back to rest after a push", () => {
    let spring = { value: 0, velocity: 3 };
    for (let frame = 0; frame < 600; frame++) spring = springStep(spring, 0, 60, 6, 1 / 60);
    expect(Math.abs(spring.value)).toBeLessThan(0.01);
  });
});

describe("wanderGaze", () => {
  it("stays inside the screen", () => {
    for (let second = 0; second < 60; second += 0.5) {
      const { x, y } = wanderGaze(second);
      expect(Math.abs(x)).toBeLessThanOrEqual(1);
      expect(Math.abs(y)).toBeLessThanOrEqual(1);
    }
  });
});
