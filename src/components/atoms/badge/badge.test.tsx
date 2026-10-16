import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content with the requested variant", () => {
    render(<Badge variant="accent">Open to positions</Badge>);

    expect(screen.getByText("Open to positions")).toHaveClass("bg-accent");
  });
});
