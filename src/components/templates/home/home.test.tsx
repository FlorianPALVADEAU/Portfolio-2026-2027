import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { Home } from "./home";

const messages = { ...en.home, badge: "Badge", cta: "Contact me" };

describe("Home", () => {
  it("renders the main landmark with the owner's name as the page heading", () => {
    render(<Home locale="fr" messages={messages} />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Florian Palvadeau" }),
    ).toBeInTheDocument();
  });

  it("renders the translated copy and a locale-aware call to action", () => {
    render(<Home locale="fr" messages={messages} />);

    expect(screen.getByText("Badge")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "/fr#contact");
  });

  it("renders every landing section with an anchor and a heading, in order", () => {
    render(<Home locale="en" messages={messages} />);

    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "Introduction",
      "Selected works",
      "Skills",
      "About me (IRL)",
      "Gallery",
      "Let's work together",
    ]);
    expect(screen.getByRole("heading", { level: 3, name: "Experience" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
  });
});
