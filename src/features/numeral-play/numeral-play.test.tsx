import { render } from "@testing-library/react";
import { Asterisk } from "lucide-react";
import { describe, expect, it } from "vitest";
import { mockMatchMedia } from "@/test/match-media";
import { NumeralPlay } from "./numeral-play";
import { SpinningMark } from "./spinning-mark";

describe("NumeralPlay", () => {
  it("draws one piece per character and hides the decoration from assistive technology", () => {
    mockMatchMedia(true);
    const { container } = render(<NumeralPlay code="404" />);

    expect(container.querySelector("p")).toHaveAttribute("aria-hidden", "true");
    expect(
      Array.from(container.querySelectorAll("[data-digit]")).map((digit) => digit.textContent),
    ).toEqual(["4", "0", "4"]);
  });
});

describe("SpinningMark", () => {
  it("renders a decorative glyph", () => {
    mockMatchMedia(true);
    const { container } = render(<SpinningMark icon={Asterisk} />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
