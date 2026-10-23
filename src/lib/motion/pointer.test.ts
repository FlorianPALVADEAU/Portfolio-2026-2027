import { describe, expect, it } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { hasFinePointer } from "./pointer";

describe("hasFinePointer", () => {
  it.each([true, false])("reads the hover and pointer media query (%s)", (matches) => {
    const spy = mockMatchMedia(matches);

    expect(hasFinePointer()).toBe(matches);
    expect(spy).toHaveBeenCalledWith("(hover: hover) and (pointer: fine)");
  });
});
