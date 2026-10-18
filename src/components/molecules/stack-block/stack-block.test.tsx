import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StackBlock } from "./stack-block";

describe("StackBlock", () => {
  it("lists every technology under a heading", () => {
    render(<StackBlock title="Stack" items={["TypeScript", "Next.js"]} />);

    expect(screen.getByRole("heading", { name: "Stack" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
