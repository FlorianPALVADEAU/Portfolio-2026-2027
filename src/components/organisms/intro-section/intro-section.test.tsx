import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { IntroSection } from "./intro-section";

describe("IntroSection", () => {
  it("renders the statement and the aside under the section heading", () => {
    render(
      <IntroSection
        title="Introduction"
        messages={en.home.intro}
        photo={en.home.photos.panorama}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Introduction" })).toBeVisible();
    expect(screen.getByText(en.home.intro.statement)).toBeVisible();
    expect(screen.getByText(en.home.intro.aside)).toBeVisible();
  });
});
