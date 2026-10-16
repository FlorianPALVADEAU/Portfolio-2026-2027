import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins truthy classes and lets later Tailwind utilities win", () => {
    expect(cn("px-2 py-1", false, "px-4")).toBe("py-1 px-4");
  });
});
