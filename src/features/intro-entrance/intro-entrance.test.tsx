import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntroEntrance } from "./intro-entrance";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", () => ({ prefersReducedMotion: () => reduced.value }));

describe("IntroEntrance", () => {
  afterEach(() => {
    reduced.value = false;
    vi.resetModules();
  });

  it("hides the marked elements until the intro opens", () => {
    render(
      <>
        <p data-entrance="">Name</p>
        <IntroEntrance />
      </>,
    );

    expect(screen.getByText("Name")).toHaveStyle({ visibility: "hidden" });
  });

  it("leaves the elements alone under reduced motion", () => {
    reduced.value = true;
    render(
      <>
        <p data-entrance="">Name</p>
        <IntroEntrance />
      </>,
    );

    expect(screen.getByText("Name")).not.toHaveStyle({ visibility: "hidden" });
  });
});
