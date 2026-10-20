import { describe, expect, it } from "vitest";
import { createWave, randomWavePoints, wavePath } from "./wave";

const wave = createWave([
  { x: 0, y: 0 },
  { x: 100, y: -50 },
  { x: 300, y: 50 },
]);

describe("createWave", () => {
  it("passes through every point and stays level outside them", () => {
    expect(wave(0)).toBe(0);
    expect(wave(100)).toBeCloseTo(-50);
    expect(wave(300)).toBeCloseTo(50);
    expect(wave(-40)).toBe(0);
    expect(wave(900)).toBe(50);
  });

  it("crosses the middle halfway between two points", () => {
    expect(wave(50)).toBeCloseTo(-25);
    expect(wave(200)).toBeCloseTo(0);
  });

  it("is level at every point, so the line has no kink", () => {
    expect(wave(99.9)).toBeCloseTo(wave(100.1), 1);
  });

  it("is flat without points", () => {
    expect(createWave([])(10)).toBe(0);
  });
});

describe("randomWavePoints", () => {
  const options = { seed: 7, width: 5000, amplitude: 200, spacing: [300, 700] } as const;
  const points = randomWavePoints(options);

  it("is the same for the same seed and differs for another", () => {
    expect(randomWavePoints(options)).toEqual(points);
    expect(randomWavePoints({ ...options, seed: 8 })).not.toEqual(points);
  });

  it("runs from 0 to the width, sorted, within the amplitude", () => {
    expect(points[0]?.x).toBe(0);
    expect(points.at(-1)?.x).toBe(5000);
    for (const [index, point] of points.entries()) {
      expect(Math.abs(point.y)).toBeLessThanOrEqual(200);
      if (index > 0) expect(point.x).toBeGreaterThan(points[index - 1]?.x ?? 0);
    }
  });

  it("alternates between crests and troughs", () => {
    for (let index = 2; index < points.length; index++) {
      expect(Math.sign(points[index]?.y ?? 0)).toBe(-Math.sign(points[index - 1]?.y ?? 0));
    }
  });
});

describe("wavePath", () => {
  it("samples from the first to the last x around the baseline", () => {
    const path = wavePath(wave, { from: 0, to: 100, step: 50, baseline: 200 });
    expect(path).toBe("M0.0 200.0L50.0 175.0L100.0 150.0");
  });
});
