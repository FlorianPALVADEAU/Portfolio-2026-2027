import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "./timeline";

describe("Timeline", () => {
  it("renders an ordered list with period, role, organization and summary", () => {
    render(
      <Timeline
        title="Experience"
        items={[
          {
            id: "a",
            period: "2025 – Present",
            title: "Engineer",
            organization: "Acme",
            summary: "Builds things.",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Experience" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Engineer, Acme")).toBeVisible();
    expect(screen.getByText("2025 – Present")).toBeVisible();
  });
});
