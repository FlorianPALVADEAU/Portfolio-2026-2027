import { describe, expect, it, vi } from "vitest";
import { hasFinePointer } from "./pointer";

describe("hasFinePointer", () => {
  it.each([true, false])("reads the hover and pointer media query (%s)", (matches) => {
    window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;

    expect(hasFinePointer()).toBe(matches);
    expect(window.matchMedia).toHaveBeenCalledWith("(hover: hover) and (pointer: fine)");
  });
});
