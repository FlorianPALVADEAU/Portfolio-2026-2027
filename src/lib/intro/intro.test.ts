import { beforeEach, describe, expect, it, vi } from "vitest";
import { hasPlayedIntro, openIntro, whenIntroOpen } from "./intro";

let reduced = false;

beforeEach(() => {
  reduced = false;
  window.sessionStorage.clear();
  window.matchMedia = ((query: string) => ({
    media: query,
    get matches() {
      return reduced;
    },
  })) as unknown as typeof window.matchMedia;
});

describe("intro", () => {
  it("waits for the intro to open, then runs once", () => {
    const callback = vi.fn();
    whenIntroOpen(callback);
    expect(callback).not.toHaveBeenCalled();

    openIntro();
    openIntro();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(hasPlayedIntro()).toBe(true);
  });

  it("runs right away once the intro has played", () => {
    openIntro();
    const callback = vi.fn();
    whenIntroOpen(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not wait under reduced motion", () => {
    reduced = true;
    const callback = vi.fn();
    whenIntroOpen(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("stops waiting when cleaned up", () => {
    const callback = vi.fn();
    whenIntroOpen(callback)();
    openIntro();
    expect(callback).not.toHaveBeenCalled();
  });
});
