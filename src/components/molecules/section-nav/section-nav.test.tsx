import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionNav } from "./section-nav";

describe("SectionNav", () => {
  it("renders a labelled navigation with one link per section", () => {
    render(
      <SectionNav
        label="Sections"
        items={[
          { href: "/en#works", label: "Work" },
          { href: "/en#contact", label: "Contact" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Sections" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/en#works");
  });
});
