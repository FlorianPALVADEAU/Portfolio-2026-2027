import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { AboutSection } from "./about-section";

describe("AboutSection", () => {
  it("renders the hook as the section heading, with the portrait and the paragraph", () => {
    render(<AboutSection index={2} title="About" messages={en.home.about} />);

    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("id", "about");
    expect(screen.getByRole("heading", { level: 2, name: en.home.about.hook })).toBeVisible();
    expect(screen.getByRole("img", { name: en.home.about.portraitAlt })).toBeInTheDocument();
    expect(screen.getByText(en.home.about.text)).toBeVisible();
  });

  it("lists the three facts as terms with their values", () => {
    render(<AboutSection index={2} title="About" messages={en.home.about} />);

    expect(screen.getAllByRole("term")).toHaveLength(3);
    expect(screen.getByText("320")).toBeVisible();
    expect(screen.getByText(en.home.about.facts.availability.label)).toBeVisible();
  });
});
