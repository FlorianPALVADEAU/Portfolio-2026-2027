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
  kicker: "That's the end of the page",
  headline: { lead: "Let's build something", accent: "worth shipping." },
  cta: "Write to me",
  top: "Back to top",
  newTab: "opens in a new tab",
  credits: {
    trigger: "Credits",
    title: "Credits of the site",
    close: "Close",
    photos: "Photographs",
    assets: "Fonts, logos and icons",
    uses: { geist: "Typeface", simpleIcons: "Logos", lucide: "Icons", mdi: "Marks" },
  },
  legal: "© 2026 Florian Palvadeau",
  navigation: "Navigation",
  profiles: "Elsewhere",
  nowPlaying: { playing: "Now playing", lastPlayed: "Last played", newTab: "opens in a new tab" },
};

describe("SiteFooter", () => {
  it("renders a contentinfo landmark with the name, navigation and picture credits", () => {
    render(<SiteFooter locale="en" nav={nav} availability="Available" messages={messages} />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent("Florian Palvadeau");
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/en#works");
    expect(screen.getByRole("button", { name: "Credits" })).toBeVisible();
    expect(
      screen.getAllByRole("link", { name: "CC BY-SA 4.0", hidden: true })[0],
    ).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("Let's build something worth shipping.");
    expect(screen.getByRole("link", { name: "Write to me" })).toHaveAttribute(
      "href",
      "/en#contact",
    );
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("button", { name: "Back to top" })).toBeVisible();
  });
});
