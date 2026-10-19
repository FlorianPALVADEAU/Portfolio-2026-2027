import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
  it("shows a zero-padded index that assistive technology skips", () => {
    render(<SectionHeader index={3} title="Skills" titleId="skills-title" />);

    expect(screen.getByRole("heading", { level: 2, name: "Skills" })).toHaveAttribute(
      "id",
      "skills-title",
    );
    expect(screen.getByText("[03]")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows no index label when none is given", () => {
    render(<SectionHeader title="Intro" titleId="intro-title" />);

    expect(screen.queryByText(/^\[\d+\]$/)).not.toBeInTheDocument();
  });
});
