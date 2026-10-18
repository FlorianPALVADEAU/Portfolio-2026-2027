import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./project-card";

const props = {
  href: "/en/projects/demo",
  title: "Demo",
  summary: "A summary",
  year: 2026,
  stack: ["Next.js", "Stripe"],
  cover: { src: "/cover.png", width: 1600, height: 900, alt: "Cover" },
};

describe("ProjectCard", () => {
  it("is a single link named by the project title", () => {
    render(<ProjectCard {...props} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Demo" })).toHaveAttribute("href", "/en/projects/demo");
    expect(screen.getByRole("heading", { level: 3, name: "Demo" })).toBeVisible();
  });

  it("shows year, summary, stack and cover", () => {
    render(<ProjectCard {...props} />);

    expect(screen.getByText("2026")).toBeVisible();
    expect(screen.getByText("A summary")).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Cover" })).toBeVisible();
  });
});
