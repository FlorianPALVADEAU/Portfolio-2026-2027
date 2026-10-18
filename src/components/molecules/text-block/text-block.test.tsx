import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextBlock } from "./text-block";

describe("TextBlock", () => {
  it("renders an optional h2 and every paragraph", () => {
    render(<TextBlock title="Overview" paragraphs={["One", "Two"]} />);

    expect(screen.getByRole("heading", { level: 2, name: "Overview" })).toBeVisible();
    expect(screen.getByText("Two")).toBeVisible();
  });

  it("omits the heading without a title", () => {
    render(<TextBlock paragraphs={["One"]} />);
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
