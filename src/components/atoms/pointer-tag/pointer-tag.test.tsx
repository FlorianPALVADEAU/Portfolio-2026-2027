import { render } from "@testing-library/react";
import { ArrowDown } from "lucide-react";
import { describe, expect, it } from "vitest";
import { PointerTag } from "./pointer-tag";

describe("PointerTag", () => {
  it("shows its label, hidden from assistive technology and from clicks", () => {
    const { container } = render(
      <PointerTag icon={ArrowDown} anchor="pointer">
        Scroll
      </PointerTag>,
    );

    const tag = container.firstElementChild;
    expect(tag).toHaveTextContent("Scroll");
    expect(tag).toHaveAttribute("aria-hidden", "true");
    expect(tag).toHaveClass("pointer-events-none", "invisible");
  });
});
