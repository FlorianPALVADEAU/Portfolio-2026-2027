import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { skillIcon } from "@/lib/landing";
import { SkillCard } from "./skill-card";

describe("SkillCard", () => {
  it("names the skill and hides the decorations from assistive technology", () => {
    const { container } = render(
      <SkillCard
        index={1}
        name="TypeScript"
        category="Engineering"
        icon={skillIcon("TypeScript")}
      />,
    );

    expect(screen.getByText("TypeScript")).toBeVisible();
    expect(screen.getByText("01")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Engineering")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(2);
  });

  it("has no logo when the skill has none", () => {
    const { container } = render(
      <SkillCard index={16} name="Scrum" category="Delivery" icon={null} />,
    );

    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});
