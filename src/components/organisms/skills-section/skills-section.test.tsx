import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { SkillsSection } from "./skills-section";

describe("SkillsSection", () => {
  it("lists every group and only the confirmed certifications", () => {
    render(<SkillsSection index={3} title="Skills" messages={en.home.skills} />);

    for (const name of ["Engineering", "Infrastructure", "Delivery", "Collaboration"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    const certifications = screen.getByRole("heading", { name: "Certifications" }).parentElement;
    const entries = within(certifications as HTMLElement).getAllByRole("listitem");
    expect(entries.map((entry) => entry.textContent)).toEqual([
      "CKAD, 92%CNCF · 2026",
      "PSM IScrum.org · 2025",
      "AWS Developer AssociateAWS · 2025",
    ]);
    expect(screen.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
  });
});
