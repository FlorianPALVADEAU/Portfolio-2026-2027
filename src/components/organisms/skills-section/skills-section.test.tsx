import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { SkillsSection } from "./skills-section";

describe("SkillsSection", () => {
  it("lists every group and only the confirmed certifications", () => {
    render(
      <SkillsSection
        index={3}
        title="Skills"
        messages={en.home.skills}
        photo={en.home.photos.closing}
      />,
    );

    for (const name of ["Engineering", "Infrastructure", "Delivery", "Collaboration"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    const certifications = screen.getByRole("region", { name: "Certifications" });
    const entries = within(certifications).getAllByRole("listitem");
    expect(entries).toHaveLength(3);
    const checks = within(certifications).getAllByRole("link");
    expect(checks.map((link) => link.getAttribute("href"))).toEqual([
      "https://training.linuxfoundation.org/certification/verify/",
      "https://www.scrum.org/user/1559892",
      "https://aws.amazon.com/verification",
    ]);
    expect(within(certifications).getByText("LF-gm9o7dmr8j")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Skills" })).toHaveAttribute("id", "skills");
  });
});
