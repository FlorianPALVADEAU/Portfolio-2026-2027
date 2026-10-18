import { describe, expect, it, vi } from "vitest";
import { onReducedMotionChange, prefersReducedMotion } from "./reduced-motion";

describe("reduced motion", () => {
  it("reads the media query", () => {
    window.matchMedia = vi
      .fn()
      .mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    expect(prefersReducedMotion()).toBe(true);
  });

  it("subscribes and unsubscribes to changes", () => {
    const add = vi.fn();
    const remove = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: add,
      removeEventListener: remove,
    }) as unknown as typeof window.matchMedia;

    const off = onReducedMotionChange(() => {});
    expect(add).toHaveBeenCalledWith("change", expect.any(Function));

    off();
    expect(remove).toHaveBeenCalledWith("change", add.mock.calls[0]?.[1]);
  });
});
