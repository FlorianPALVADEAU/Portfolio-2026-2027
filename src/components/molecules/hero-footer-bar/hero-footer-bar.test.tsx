import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroFooterBar } from "./hero-footer-bar";

describe("HeroFooterBar", () => {
  it("shows the badge and a CV download", () => {
    render(<HeroFooterBar badge="Open to work" cv="Download CV" cvHref="/cv/en/cv.pdf" />);

    expect(screen.getByText("Open to work")).toBeVisible();
    expect(screen.getByRole("link", { name: "Download CV" })).toHaveAttribute("download");
  });

  it("leaves the button out when there is no CV", () => {
    render(<HeroFooterBar badge="Open to work" cv="Download CV" />);

    expect(screen.queryByRole("link")).toBeNull();
  });
});
