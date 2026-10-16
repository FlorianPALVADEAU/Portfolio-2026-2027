import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Home } from "./home";

describe("Home", () => {
  it("renders the main landmark with the owner's name as the page heading", () => {
    render(<Home />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Florian Palvadeau" }),
    ).toBeInTheDocument();
  });
});
