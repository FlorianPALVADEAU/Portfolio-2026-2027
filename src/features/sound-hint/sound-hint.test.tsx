import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

let soundOn = false;
vi.mock("@/lib/sound", () => ({
  getSoundEnabled: () => soundOn,
  getServerSoundEnabled: () => false,
  subscribeSound: () => () => {},
}));
vi.mock("@/lib/intro", () => ({
  whenIntroOpen: (callback: () => void) => {
    callback();
    return () => {};
  },
}));
vi.mock("gsap", () => ({
  gsap: {
    timeline: () => ({ fromTo: () => ({ to: () => ({}) }) }),
    to: (_: unknown, vars: { onComplete?: () => void }) => vars.onComplete?.(),
    killTweensOf: vi.fn(),
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  soundOn = false;
  window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;
});

async function mount() {
  const { SoundHint } = await import("./sound-hint");
  return render(<SoundHint label="Turn the sound on" />);
}

describe("SoundHint", () => {
  it("appears after the page opens while sound is off", async () => {
    await mount();
    expect(screen.queryByText("Turn the sound on")).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText("Turn the sound on")).toBeInTheDocument();
  });

  it("goes away on the first interaction", async () => {
    await mount();
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    await act(async () => {
      window.dispatchEvent(new Event("pointerdown"));
    });

    expect(screen.queryByText("Turn the sound on")).toBeNull();
  });

  it("never appears when sound is already on", async () => {
    soundOn = true;
    await mount();
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.queryByText("Turn the sound on")).toBeNull();
  });
});
