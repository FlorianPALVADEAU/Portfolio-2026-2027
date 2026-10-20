import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RailNode, RailNodes, RailSlide, WaveRail } from ".";

function mockMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
}

function renderRail() {
  return render(
    <WaveRail chapters={[{ id: "engineering", label: "Engineering" }]}>
      <RailSlide ghost="Engineering" tone="oklch(0.68 0.16 255)" heading={<h3>Engineering</h3>}>
        <RailNodes>
          <RailNode index={1} label="TypeScript" />
          <RailNode index={2} label="React" />
        </RailNodes>
      </RailSlide>
    </WaveRail>,
  );
}

describe("WaveRail", () => {
  it("keeps a plain, readable list under reduced motion", () => {
    mockMotion(true);
    const { container } = renderRail();

    expect(container.querySelector("[data-motion]")).toHaveAttribute("data-motion", "static");
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "01TypeScript",
      "02React",
    ]);
  });

  it("stays static when the content does not overflow the viewport", () => {
    mockMotion(false);
    const { container } = renderRail();

    expect(container.querySelector("[data-motion]")).toHaveAttribute("data-motion", "static");
  });

  it("hides the decorations from assistive technology", () => {
    mockMotion(true);
    const { container } = renderRail();

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    const copies = screen.getAllByText("Engineering").filter((node) => node.tagName !== "H3");
    expect(copies.length).toBeGreaterThan(0);
    for (const copy of copies) expect(copy.closest("[aria-hidden='true']")).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Engineering" })).toBeInTheDocument();
  });
});
