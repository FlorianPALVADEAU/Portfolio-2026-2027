import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeaderReveal } from "./header-reveal";

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("HeaderReveal", () => {
  it("hides when scrolling down and returns when scrolling up", () => {
    render(
      <HeaderReveal>
        <a href="/">Home</a>
      </HeaderReveal>,
    );
    const header = screen.getByRole("banner");

    scrollTo(400);
    expect(header).toHaveClass("-translate-y-[calc(100%+0.75rem)]");

    scrollTo(300);
    expect(header).not.toHaveClass("-translate-y-[calc(100%+0.75rem)]");
  });

  it("stays visible near the top", () => {
    render(
      <HeaderReveal>
        <a href="/">Home</a>
      </HeaderReveal>,
    );

    scrollTo(40);

    expect(screen.getByRole("banner")).not.toHaveClass("-translate-y-[calc(100%+0.75rem)]");
  });
});
