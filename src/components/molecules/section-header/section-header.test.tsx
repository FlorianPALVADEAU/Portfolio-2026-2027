import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./section-header";

describe("SectionHeader", () => {
  it("renders a level-2 heading that can label its section", () => {
    render(<SectionHeader title="Skills" titleId="skills-title" />);

    expect(screen.getByRole("heading", { level: 2, name: "Skills" })).toHaveAttribute(
      "id",
      "skills-title",
    );
  });
});
