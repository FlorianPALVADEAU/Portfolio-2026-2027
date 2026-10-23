import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { Frame, FrameRail } from ".";

function mockMotion(reduced: boolean) {
  mockMatchMedia(reduced);
}

function renderRail() {
  return render(
    <FrameRail
      navLabel="Parts"
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

  it("offers the bar as navigation that names every frame", () => {
    mockMotion(true);
    renderRail();

    const nav = screen.getByRole("navigation", { name: "Parts" });
    expect(within(nav).getAllByRole("button")).toHaveLength(2);
    expect(within(nav).getByRole("button", { name: /Second/ })).toBeInTheDocument();
  });
});
