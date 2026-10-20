import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WaveArt } from "./wave-art";

function paths(seed: number) {
  const { container } = render(<WaveArt seed={seed} />);
  return Array.from(container.querySelectorAll("path"), (path) => path.getAttribute("d"));
}

describe("WaveArt", () => {
  it("is decorative", () => {
    const { container } = render(<WaveArt seed={1} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("draws the same lines for a seed and other lines for another seed", () => {
    expect(paths(3)).toEqual(paths(3));
    expect(paths(3)).not.toEqual(paths(4));
    expect(paths(3)).toHaveLength(12);
  });
});
