import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlipText } from "./flip-text";

describe("FlipText", () => {
  it("keeps the plain text for assistive tech and hides the rolling copy", () => {
    const { container } = render(<FlipText>Let's talk</FlipText>);

    expect(screen.getByText("Let's talk")).toHaveClass("sr-only");
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("gives every letter its own strip, indexed for the stagger", () => {
    const { container } = render(<FlipText>Go on</FlipText>);
    const strips = container.querySelectorAll<HTMLElement>(".flip-strip");

    expect(strips).toHaveLength("Goon".length);
    expect(strips[3]?.style.getPropertyValue("--i")).toBe("4");
  });
});
