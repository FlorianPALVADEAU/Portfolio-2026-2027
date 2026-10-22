import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/sound/music", () => ({
  startMusic: vi.fn(),
  stopMusic: vi.fn(),
  warmMusic: vi.fn(),
}));

const load = async () => {
  vi.resetModules();
  const [{ BackgroundMusic }, sound] = await Promise.all([
    import("./background-music"),
    import("@/lib/sound"),
  ]);
  return { BackgroundMusic, sound };
};

describe("BackgroundMusic first action", () => {
  beforeEach(() => localStorage.clear());

  it("turns sound on at the first click of a visitor who never chose", async () => {
    const { BackgroundMusic, sound } = await load();
    render(<BackgroundMusic />);
    expect(sound.getSoundEnabled()).toBe(false);

    fireEvent.pointerDown(document.body);

    expect(sound.getSoundEnabled()).toBe(true);
  });

  it("ignores a key that only moves around the page", async () => {
    const { BackgroundMusic, sound } = await load();
    render(<BackgroundMusic />);

    fireEvent.keyDown(document.body, { key: "Tab" });

    expect(sound.getSoundEnabled()).toBe(false);
  });

  it("respects a visitor who muted sound earlier", async () => {
    localStorage.setItem("sound", "off");
    const { BackgroundMusic, sound } = await load();
    render(<BackgroundMusic />);

    fireEvent.pointerDown(document.body);

    expect(sound.getSoundEnabled()).toBe(false);
  });
});
