import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultsBlock } from "./results-block";

describe("ResultsBlock", () => {
  it("pairs each label with its value", () => {
    render(<ResultsBlock title="Results" items={[{ label: "Locales", value: "3" }]} />);

    expect(screen.getByText("Locales")).toBeVisible();
    expect(screen.getByText("3")).toBeVisible();
  });
});
