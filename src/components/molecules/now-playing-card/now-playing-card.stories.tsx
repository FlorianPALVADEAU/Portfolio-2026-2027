import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NowPlayingCard } from "./now-playing-card";

const meta = {
  title: "Molecules/NowPlayingCard",
  component: NowPlayingCard,
  args: {
    track: {
      title: "Weightless",
      artist: "Marconi Union",
      url: "https://open.spotify.com",
      cover: null,
      playing: true,
    },
    messages: { playing: "Now playing", lastPlayed: "Last played", newTab: "opens in a new tab" },
  },
  decorators: [
    (Story) => (
      <div className="bg-foreground p-6 text-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NowPlayingCard>;

export default meta;

export const Playing: StoryObj<typeof meta> = {};

export const WithCover: StoryObj<typeof meta> = {
  args: {
    track: {
      title: "Weightless",
      artist: "Marconi Union",
      url: "https://open.spotify.com",
      cover: "/photos/lavaux-church.jpg",
      playing: true,
    },
  },
};

export const LastPlayed: StoryObj<typeof meta> = {
  args: {
    track: {
      title: "A title long enough to be cut by the card",
      artist: "An artist with a long name too",
      url: "https://open.spotify.com",
      cover: null,
      playing: false,
    },
  },
};
