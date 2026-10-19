import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PhotoTrail } from "./photo-trail";

describe("PhotoTrail", () => {
  it("is a hidden, inert layer that holds no picture under reduced motion", () => {
    const { container } = render(<PhotoTrail photos={["/a.jpg", "/b.jpg"]} />);

    const layer = container.firstElementChild;
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer?.querySelectorAll("img")).toHaveLength(0);
  });
});
