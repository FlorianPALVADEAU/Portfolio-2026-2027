import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { VideoPlayer } from "./video-player";

const labels = {
  play: "Play video",
  pause: "Pause video",
  mute: "Mute",
  unmute: "Unmute",
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
  seek: "Position in the video",
  loading: "Loading",
  volume: "Volume",
};

const play = vi.fn(() => Promise.resolve());
const pause = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  window.HTMLMediaElement.prototype.play = play;
  window.HTMLMediaElement.prototype.pause = pause;
});

function mount() {
  return render(
    <VideoPlayer
      src="/race.mp4"
      poster={{ src: "/poster.jpg", width: 1600, height: 900 }}
      label="Race day"
      labels={labels}
    />,
  );
}

describe("VideoPlayer", () => {
  it("downloads nothing and starts nothing until it is played", () => {
    const { container } = mount();

    expect(container.querySelector("video")?.getAttribute("preload")).toBe("none");
    expect(play).not.toHaveBeenCalled();
    expect(screen.getByRole("group", { name: "Race day" })).toBeVisible();
  });

  it("plays from the poster button and then offers the controls", () => {
    mount();

    fireEvent.click(screen.getByRole("button", { name: "Play video" }));

    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("slider", { name: "Position in the video" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Full screen" })).toBeInTheDocument();
  });

  it("toggles with the k key", () => {
    mount();
    const player = screen.getByRole("group", { name: "Race day" });

    fireEvent.keyDown(player, { key: "k" });

    expect(play).toHaveBeenCalledTimes(1);
  });
});
