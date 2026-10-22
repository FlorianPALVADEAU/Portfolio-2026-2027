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

  it("goes quiet while suspended and comes back as it was", async () => {
    const { getSoundEnabled, setSoundEnabled, suspendSound, subscribeSound } = await import(
      "./preference"
    );
    setSoundEnabled(true);
    const listener = vi.fn();
    subscribeSound(listener);

    const release = suspendSound();
    expect(getSoundEnabled()).toBe(false);
    expect(localStorage.getItem("sound")).toBe("on");

    release();
    release();
    expect(getSoundEnabled()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("stays quiet until every hold is released", async () => {
    const { getSoundEnabled, setSoundEnabled, suspendSound } = await import("./preference");
    setSoundEnabled(true);

    const first = suspendSound();
    const second = suspendSound();
    first();

    expect(getSoundEnabled()).toBe(false);
    second();
    expect(getSoundEnabled()).toBe(true);
  });
});
