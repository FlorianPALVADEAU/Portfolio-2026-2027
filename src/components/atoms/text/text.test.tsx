import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text", () => {
  it("renders a paragraph by default and can change element and tone", () => {
    const { rerender } = render(<Text>Body</Text>);
    expect(screen.getByText("Body").tagName).toBe("P");

    rerender(
      <Text as="span" tone="muted">
        Body
      </Text>,
    );
    expect(screen.getByText("Body")).toHaveClass("text-muted-foreground");
    expect(screen.getByText("Body").tagName).toBe("SPAN");
  });
});
