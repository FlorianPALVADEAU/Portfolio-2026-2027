import { render, screen } from "@testing-library/react";
import { Check } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

describe("Icon", () => {
  it("is hidden from assistive technology unless it has a label", () => {
    const { container, rerender } = render(<Icon icon={Check} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");

    rerender(<Icon icon={Check} label="Done" />);
    expect(screen.getByRole("img", { name: "Done" })).toBeInTheDocument();
  });
});
