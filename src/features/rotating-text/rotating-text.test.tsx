import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RotatingText } from "./rotating-text";

describe("RotatingText", () => {
  it("reads the base and the first ending once, and hides the rolling copy", () => {
    const { container } = render(
      <RotatingText base="Code" phrases={["that holds.", "built to last."]} />,
    );

    expect(screen.getByText("Code that holds.")).toHaveClass("sr-only");
    expect(container.querySelector("[aria-hidden='true']")).toHaveTextContent(
      "Codethat holds.built to last.",
    );
  });
});
