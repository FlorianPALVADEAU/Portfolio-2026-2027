import { describe, expect, it } from "vitest";
import { damp, poseFor, wanderGaze } from "./duck-motion";

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

describe("poseFor", () => {
  it("turns the head further than the body, and centred looks straight ahead", () => {
    const pose = poseFor({ x: 1, y: 0 });
    expect(pose.headYaw).toBeGreaterThan(pose.bodyYaw);
    expect(poseFor({ x: 0, y: 0 })).toMatchObject({ bodyYaw: 0, headYaw: 0, eyeX: 0 });
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
