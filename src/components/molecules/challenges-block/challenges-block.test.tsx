import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChallengesBlock } from "./challenges-block";

describe("ChallengesBlock", () => {
  it("renders each challenge as an h3 with its body", () => {
    render(
      <ChallengesBlock title="Challenges" items={[{ title: "Scale", body: "Handled load" }]} />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Scale" })).toBeVisible();
    expect(screen.getByText("Handled load")).toBeVisible();
  });
});
