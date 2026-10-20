import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Frame, FrameRail } from ".";

function mockMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
}

function renderRail() {
  return render(
    <FrameRail
      frames={[
        { id: "one", label: "First" },
        { id: "two", label: "Second" },
      ]}
    >
      <Frame aria-labelledby="one">
        <h3 id="one">First frame</h3>
        <span data-count-to="40">40</span>
      </Frame>
      <Frame aria-labelledby="two">
        <h3 id="two">Second frame</h3>
      </Frame>
    </FrameRail>,
  );
}

describe("FrameRail", () => {
  it("keeps the frames stacked and readable under reduced motion", () => {
    mockMotion(true);
    const { container } = renderRail();

    expect(container.querySelector("[data-motion]")).toHaveAttribute("data-motion", "static");
    expect(screen.getAllByRole("region").map((frame) => frame.textContent)).toEqual([
      "First frame40",
      "Second frame",
    ]);
    expect(container.querySelector("[data-reveal]")).toBeNull();
  });

  it("stays static when the frames do not overflow the viewport", () => {
    mockMotion(false);
    const { container } = renderRail();

    expect(container.querySelector("[data-motion]")).toHaveAttribute("data-motion", "static");
  });

  it("hides the progress bar from assistive technology", () => {
    mockMotion(true);
    renderRail();

    const label = screen.getByText("Second", { selector: "span" });
    expect(label.closest("[aria-hidden='true']")).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Second frame" })).toBeInTheDocument();
  });
});
