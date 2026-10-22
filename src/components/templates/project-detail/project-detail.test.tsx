import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectDetail } from "./project-detail";

const project = {
  title: "Demo",
  summary: "A summary",
  role: "Developer",
  year: 2026,
  cover: { src: "/cover.png", width: 1600, height: 900, alt: "Cover" },
  blocks: [
    { id: "a", type: "text", title: "Overview", paragraphs: ["Hello"] },
    { id: "s", type: "stack", title: "Stack", items: ["Next.js", "Stripe"] },
    {
      id: "l",
      type: "links",
      title: "Links",
      items: [{ id: "site", href: "https://example.com" }],
      labels: { site: "Launch project" },
    },
  ],
} as const;

describe("ProjectDetail", () => {
  it("has a single h1, facts, a back link and the blocks", () => {
    render(
      <ProjectDetail
        locale="en"
        messages={{ back: "Back to home", role: "Role", year: "Year" }}
        project={project}
      />,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("Role")).toBeVisible();
    expect(screen.getByText("Developer")).toBeVisible();
    expect(screen.getByText("2026")).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("heading", { level: 2, name: "Overview" })).toBeVisible();
  });

  it("lifts the stack and the links into the intro instead of repeating them as panels", () => {
    render(
      <ProjectDetail
        locale="en"
        messages={{ back: "Back to home", role: "Role", year: "Year" }}
        project={project}
      />,
    );

    expect(screen.getByText("Next.js · Stripe")).toBeVisible();
    expect(screen.getByRole("link", { name: "Launch project" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.queryByRole("heading", { name: "Links" })).toBeNull();
    expect(document.querySelectorAll("[data-story-panel]")).toHaveLength(3);
  });
});
