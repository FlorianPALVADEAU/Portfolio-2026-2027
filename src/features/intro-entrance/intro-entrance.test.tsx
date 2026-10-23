import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { openIntro } from "@/lib/intro";
import { IntroCover } from "./intro-cover";
import { IntroEntrance } from "./intro-entrance";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", () => ({ prefersReducedMotion: () => reduced.value }));

const pending = () => document.documentElement.hasAttribute("data-intro-pending");

describe("IntroEntrance", () => {
  afterEach(() => {
    reduced.value = false;
  });

  it("holds the page back through an attribute of the root until the intro opens", () => {
    const { container, unmount } = render(
      <>
        <p data-intro-step="0">Name</p>
        <IntroEntrance />
      </>,
    );

    expect(pending()).toBe(true);
    // Never an inline style: it would not match the server HTML while hydrating.
    expect(container.querySelector("p")?.getAttribute("style")).toBeNull();

    unmount();
    expect(pending()).toBe(false);
  });

  it("makes the page behind the loader inert, then releases it", () => {
    // Rendered into the body itself, as the layout does, so the loader is a sibling of the page.
    const { unmount } = render(
      <>
        <IntroCover>
          <main>Page</main>
        </IntroCover>
        <div data-intro-loader />
        <IntroEntrance />
      </>,
      { container: document.body },
    );
    const page = document.querySelector("[data-intro-covered]");

    expect(page).toHaveAttribute("inert");
    expect(document.querySelector("[data-intro-loader]")).not.toHaveAttribute("inert");

    act(() => openIntro());
    expect(page).not.toHaveAttribute("inert");

    unmount();
  });

  it("holds nothing back under reduced motion", () => {
    reduced.value = true;
    render(<IntroEntrance />);

    expect(pending()).toBe(false);
  });
});
