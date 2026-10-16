import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "./stack";

describe("Stack", () => {
  it("lays children out in a column with the requested gap", () => {
    const { container } = render(
      <Stack gap="lg">
        <span>a</span>
      </Stack>,
    );

    expect(container.firstChild).toHaveClass("flex-col", "gap-10");
  });
});
