import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NowPlaying } from "./now-playing";

const messages = {
  playing: "Now playing",
  lastPlayed: "Last played",
  newTab: "opens in a new tab",
};
const track = { title: "Song", artist: "Artist", url: "https://open.spotify.com/track/1" };

const answer = (status: number, body?: unknown) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status, json: async () => body }));

describe("NowPlaying", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("links the track that plays now", async () => {
    answer(200, { ...track, playing: true });
    render(<NowPlaying messages={messages} />);

    const link = await screen.findByRole("link", { name: /Song, Artist/ });
    expect(link).toHaveAttribute("href", track.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText(/Now playing/)).toBeInTheDocument();
  });

  it("says the track was the last one played when nothing plays now", async () => {
    answer(200, { ...track, playing: false });
    render(<NowPlaying messages={messages} />);

    await screen.findByRole("link", { name: /Song/ });
    expect(screen.getByText(/Last played/)).toBeInTheDocument();
  });

  it("renders nothing when there is no track or the request fails", async () => {
    answer(204);
    const { container, rerender } = render(<NowPlaying messages={messages} />);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    rerender(<NowPlaying messages={{ ...messages }} key="again" />);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
