import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

const nav = {
  label: "Sections",
  works: "Work",
  skills: "Skills",
  about: "About",
  contact: "Contact",
};
const messages = {
  photos: "Photos:",
  legal: "© 2026 Florian Palvadeau",
  navigation: "Navigation",
  profiles: "Elsewhere",
  nowPlaying: { playing: "Now playing", lastPlayed: "Last played", newTab: "opens in a new tab" },
};

describe("SiteFooter", () => {
  it("renders a contentinfo landmark with the name, navigation and picture credits", () => {
    render(<SiteFooter locale="en" nav={nav} messages={messages} />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent("Florian Palvadeau");
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/en#works");
    expect(screen.getAllByRole("link", { name: "CC BY-SA 4.0" })[0]).toBeVisible();
  });
});
