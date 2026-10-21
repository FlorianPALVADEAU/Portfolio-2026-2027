import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Rise } from "./rise";

describe("Rise", () => {
  it("wraps its content in a mask and a mover and keeps it readable", () => {
    const { container } = render(<Rise>Hello</Rise>);

    expect(screen.getByText("Hello")).toBeVisible();
    expect(container.querySelector("[data-rise-mask] > [data-rise-word]")).not.toBeNull();
  });
});
