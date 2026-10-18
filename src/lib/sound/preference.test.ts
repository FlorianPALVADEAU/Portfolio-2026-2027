import { beforeEach, describe, expect, it, vi } from "vitest";

describe("sound preference", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("is muted by default", async () => {
    const { getSoundEnabled, getServerSoundEnabled } = await import("./preference");
    expect(getSoundEnabled()).toBe(false);
    expect(getServerSoundEnabled()).toBe(false);
  });

  it("persists the choice and notifies subscribers", async () => {
    const { getSoundEnabled, setSoundEnabled, subscribeSound } = await import("./preference");
    const listener = vi.fn();
    const unsubscribe = subscribeSound(listener);

    setSoundEnabled(true);

    expect(getSoundEnabled()).toBe(true);
    expect(localStorage.getItem("sound")).toBe("on");
    expect(listener).toHaveBeenCalledOnce();

    unsubscribe();
    setSoundEnabled(false);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("restores a stored opt-in", async () => {
    localStorage.setItem("sound", "on");
    const { getSoundEnabled } = await import("./preference");
    expect(getSoundEnabled()).toBe(true);
  });
});
