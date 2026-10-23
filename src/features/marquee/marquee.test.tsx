import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { Marquee } from "./marquee";

const props = {
  items: [
    { id: "react", content: "React" },
    { id: "nest", content: "NestJS" },
  ],
  label: "Tech",
};

function mockBrowser(reduced: boolean) {
  mockMatchMedia(reduced);
  const observer = class {
    observe = vi.fn();
    disconnect = vi.fn();
  };
  vi.stubGlobal("ResizeObserver", observer);
  vi.stubGlobal("IntersectionObserver", observer);
}

describe("Marquee", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is static and has no control under reduced motion", () => {
    mockBrowser(true);
    render(<Marquee {...props} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Tech" })).toBeInTheDocument();
  });

  it("announces one list and hides the loop copies from assistive technology", () => {
    mockBrowser(false);
    render(<Marquee {...props} />);

    expect(screen.getAllByRole("list")).toHaveLength(1);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
