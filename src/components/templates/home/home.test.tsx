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
const messages = { ...en.home, badge: "Badge" };

describe("Home", () => {
  it("renders the main landmark with the owner's name in the page heading", () => {
    render(<Home locale="fr" messages={messages} projects={projects} />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /Florian Palvadeau/ }),
    ).toBeInTheDocument();
  });

  it("renders the translated availability in the hero", () => {
    render(<Home locale="fr" messages={messages} projects={projects} />);

    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("renders every landing section with an anchor and a heading, in order", () => {
    render(<Home locale="en" messages={messages} projects={projects} />);

    const headings = [
      "Software engineer by day, race organiser on the side.",
      "Selected works",
      "Skills",
      "Gallery",
      "Let's work together",
    ].map((name) => screen.getByRole("heading", { level: 2, name }));
    expect(screen.getAllByRole("heading", { level: 2 })).toEqual(headings);
    expect(screen.getByRole("region", { name: "Introduction" })).toHaveAttribute("id", "intro");
    expect(screen.getByRole("region", { name: "About me (IRL)" })).toHaveAttribute("id", "about");
    expect(screen.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
  });
});
