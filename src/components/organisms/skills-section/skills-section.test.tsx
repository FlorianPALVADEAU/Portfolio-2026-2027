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
    const certifications = screen.getByRole("region", { name: "Certifications" });
    const entries = within(certifications).getAllByRole("listitem");
    expect(entries.map((entry) => entry.textContent)).toEqual([
      "CNCF · 202692%CKAD",
      "Scrum.org · 2025PSM I",
      "AWS · 2025AWS Developer Associate",
    ]);
    expect(screen.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
  });
});
