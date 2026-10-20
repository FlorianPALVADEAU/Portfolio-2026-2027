import { describe, expect, it } from "vitest";
import { createWave, echoWave, wavePath } from "./wave";

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

describe("echoWave", () => {
  it("scales and shifts the original", () => {
    const echo = echoWave(wave, { scale: -0.5, shift: 20 });
    expect(echo(120)).toBeCloseTo(25);
  });
});

describe("wavePath", () => {
  it("samples from the first to the last x around the baseline", () => {
    const path = wavePath(wave, { from: 0, to: 100, step: 50, baseline: 200 });
    expect(path).toBe("M0.0 200.0L50.0 175.0L100.0 150.0");
  });
});
