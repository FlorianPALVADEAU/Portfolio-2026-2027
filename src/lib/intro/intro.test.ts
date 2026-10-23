import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test/match-media";

async function load() {
  vi.resetModules();
  return import("./intro");
}

let reduced = false;

beforeEach(() => {
  reduced = false;
  mockMatchMedia(() => reduced);
});

describe("intro", () => {
  it("waits for the intro to open, then runs once", async () => {
    const { hasPlayedIntro, openIntro, whenIntroOpen } = await load();
    const callback = vi.fn();
    whenIntroOpen(callback);
    expect(callback).not.toHaveBeenCalled();

    openIntro();
    openIntro();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(hasPlayedIntro()).toBe(true);
  });

  it("runs right away once the intro has played", async () => {
    const { openIntro, whenIntroOpen } = await load();
    openIntro();
    const callback = vi.fn();
    whenIntroOpen(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not wait under reduced motion", async () => {
    const { whenIntroOpen } = await load();
    reduced = true;
    const callback = vi.fn();
    whenIntroOpen(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("stops waiting when cleaned up", async () => {
    const { openIntro, whenIntroOpen } = await load();
    const callback = vi.fn();
    whenIntroOpen(callback)();
    openIntro();
    expect(callback).not.toHaveBeenCalled();
  });
});
