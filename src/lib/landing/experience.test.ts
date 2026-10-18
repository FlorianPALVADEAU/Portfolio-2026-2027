import { describe, expect, it } from "vitest";
import { experience, formatPeriod } from "./experience";

describe("experience", () => {
  it("formats closed and ongoing periods", () => {
    expect(formatPeriod(2022, 2023, "Present")).toBe("2022 – 2023");
    expect(formatPeriod(2025, null, "Present")).toBe("2025 – Present");
  });

  it("lists the newest start first", () => {
    const starts = experience.map((item) => item.start);
    expect(starts).toEqual([...starts].sort((a, b) => b - a));
  });
});
