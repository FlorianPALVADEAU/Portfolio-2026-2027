import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";

describe("Logo", () => {
  it("is decorative without a label", () => {
    const { container } = render(<Logo />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes an image role with a label", () => {
    render(<Logo label="FPL" />);
    expect(screen.getByRole("img", { name: "FPL" })).toBeInTheDocument();
  });
});
