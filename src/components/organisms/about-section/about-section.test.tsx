import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { AboutSection } from "./about-section";

describe("AboutSection", () => {
  it("renders the story and the career path, newest first", () => {
    render(<AboutSection index={4} title="About" messages={en.home.about} />);

    const entries = screen.getAllByRole("listitem").map((item) => item.textContent ?? "");
    expect(entries[0]).toContain("JCDecaux");
    expect(entries[0]).toContain("2025 – Present");
    expect(entries.at(-1)).toContain("Neurones IT");
    expect(screen.getByRole("region", { name: "About" })).toHaveAttribute("id", "about");
  });
});
