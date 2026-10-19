import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { Home } from "./home";

const projects = [
  {
    slug: "demo",
    title: "Demo project",
    summary: "Summary",
    year: 2026,
    stack: ["Next.js"],
    cover: { src: "/cover.png", width: 1600, height: 900, alt: "Cover" },
  },
];
const messages = { ...en.home, badge: "Badge", cta: "Contact me" };

describe("Home", () => {
  it("renders the main landmark with the owner's name as the page heading", () => {
    render(<Home locale="fr" messages={messages} projects={projects} />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Florian Palvadeau" }),
    ).toBeInTheDocument();
  });

  it("renders the translated copy and a locale-aware call to action", () => {
    render(<Home locale="fr" messages={messages} projects={projects} />);

    expect(screen.getByText("Badge")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "/fr#contact");
  });

  it("renders every landing section with an anchor and a heading, in order", () => {
    render(<Home locale="en" messages={messages} projects={projects} />);

    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "Introduction",
      "Selected works",
      "Skills",
      "About me (IRL)",
      "Let's work together",
    ]);
    expect(screen.getByRole("heading", { level: 3, name: "Experience" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
  });
});
