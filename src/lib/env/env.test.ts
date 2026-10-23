import { describe, expect, it } from "vitest";
import { optional } from "./env";

describe("optional", () => {
  it("treats unset and blank values as not configured", () => {
    expect(optional(undefined)).toBeUndefined();
    expect(optional("")).toBeUndefined();
    expect(optional("   ")).toBeUndefined();
  });

  it("trims a configured value", () => {
    expect(optional(" +41 00 ")).toBe("+41 00");
  });
});
