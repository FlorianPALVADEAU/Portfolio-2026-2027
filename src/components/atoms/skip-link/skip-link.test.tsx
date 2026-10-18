import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("is the first tab stop and points at its target", async () => {
    render(
      <>
        <SkipLink href="#main">Skip to content</SkipLink>
        <button type="button">Other</button>
      </>,
    );

    await userEvent.tab();

    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "#main");
  });
});
