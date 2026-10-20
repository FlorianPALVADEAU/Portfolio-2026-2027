import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardRail, RailCard, RailCards, RailChapter, RailPanel } from ".";

function mockMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
}

function renderRail() {
  return render(
    <CardRail chapters={[{ id: "engineering", label: "Engineering" }]}>
      <RailPanel>
        <h2>Skills</h2>
      </RailPanel>
      <RailChapter numeral="01" heading={<h3>Engineering</h3>}>
        <RailCards>
          <RailCard>TypeScript</RailCard>
          <RailCard>React</RailCard>
        </RailCards>
      </RailChapter>
    </CardRail>,
  );
}

describe("CardRail", () => {
  it("keeps a plain, readable list under reduced motion", () => {
    mockMotion(true);
    const { container } = renderRail();

    expect(container.querySelector("[data-motion]")).toHaveAttribute("data-motion", "static");
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "TypeScript",
      "React",
    ]);
  });

  it("stays static when the content does not overflow the viewport", () => {
    mockMotion(false);
    const { container } = renderRail();

    expect(container.querySelector("[data-motion]")).toHaveAttribute("data-motion", "static");
  });

  it("hides the decorations from assistive technology", () => {
    mockMotion(true);
    renderRail();

    const decorations = [
      ...screen.getAllByText("01", { selector: "span" }),
      ...screen.getAllByText("Engineering", { selector: "span" }),
    ];
    expect(decorations.length).toBeGreaterThan(0);
    for (const decoration of decorations) {
      expect(decoration.closest("[aria-hidden='true']")).not.toBeNull();
    }
    expect(screen.getByRole("heading", { name: "Engineering" })).toBeInTheDocument();
  });
});
