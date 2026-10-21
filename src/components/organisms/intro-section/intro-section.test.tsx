import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { IntroSection } from "./intro-section";

describe("IntroSection", () => {
  it("renders the paragraph under a labelled region", () => {
    render(<IntroSection title="Introduction" messages={en.home.intro} />);

    expect(screen.getByRole("region", { name: "Introduction" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Introduction" })).toHaveTextContent(
      /I design, build and run web applications/,
    );
  });

  it("lists the companies as named logos", () => {
    render(<IntroSection title="Introduction" messages={en.home.intro} />);

    expect(screen.getAllByRole("img", { name: "JCDecaux" })[0]).toHaveAttribute(
      "src",
      "/brand/companies/jcdecaux.svg",
    );
    expect(screen.getByRole("region", { name: en.home.intro.clients })).toBeInTheDocument();
  });
});

describe("IntroSection trust line", () => {
  it("states services, not a headcount", () => {
    render(<IntroSection title="Introduction" messages={en.home.intro} />);

    expect(screen.getByText("Services delivered for teams at")).toBeInTheDocument();
  });
});
