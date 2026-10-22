import { describe, expect, it } from "vitest";
import { formatTime } from "./format-time";

describe("formatTime", () => {
  it("reads minutes and padded seconds", () => {
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(125.9)).toBe("2:05");
  });

  it("adds hours from an hour on", () => {
    expect(formatTime(3725)).toBe("1:02:05");
  });

  it("reads anything unknown as zero", () => {
    expect(formatTime(Number.NaN)).toBe("0:00");
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe("0:00");
    expect(formatTime(-3)).toBe("0:00");
  });
});
