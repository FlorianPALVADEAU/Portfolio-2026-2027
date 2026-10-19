import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LiquidImage } from "./liquid-image";

describe("LiquidImage", () => {
  it("always renders the described picture, with a hidden canvas for the ripple", () => {
    const { container } = render(<LiquidImage src="/a.jpg" alt="Portrait" sizes="10vw" />);

    expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
    expect(container.querySelector("canvas")?.parentElement).toHaveAttribute("aria-hidden", "true");
  });
});
