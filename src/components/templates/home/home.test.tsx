import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Home } from "./home";

const messages = { badge: "Badge", role: "Role", cta: "Contact me" };

describe("Home", () => {
  it("renders the main landmark with the owner's name as the page heading", () => {
    render(<Home locale="fr" messages={messages} />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Florian Palvadeau" }),
    ).toBeInTheDocument();
  });

  it("renders the translated copy and a locale-aware call to action", () => {
    render(<Home locale="fr" messages={messages} />);

    expect(screen.getByText("Badge")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute("href", "/fr#contact");
  });
});
