import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { WorksSection } from "./works-section";

const project = {
  slug: "demo",
  title: "Demo",
  summary: "A summary",
  year: 2026,
  stack: ["Next.js"],
  cover: { src: "/cover.png", width: 1600, height: 900, alt: "Cover" },
};

describe("WorksSection", () => {
  it("links every project to its locale-aware page", () => {
    render(
      <WorksSection
        title="Selected works"
        locale="fr"
        messages={en.home.works}
        projects={[project]}
      />,
    );

    expect(screen.getByRole("region", { name: "Selected works" })).toHaveAttribute("id", "works");
    expect(screen.getByRole("link", { name: "Demo" })).toHaveAttribute("href", "/fr/projects/demo");
  });
});
