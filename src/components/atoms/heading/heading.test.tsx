import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./heading";

describe("Heading", () => {
  it("renders the requested semantic level regardless of its visual size", () => {
    render(
      <Heading level={2} size="display">
        Title
      </Heading>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toHaveClass("text-display");
  });
});
