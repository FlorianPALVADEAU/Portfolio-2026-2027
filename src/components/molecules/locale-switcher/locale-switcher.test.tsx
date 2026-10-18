import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleSwitcher } from "./locale-switcher";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/notes" }));

describe("LocaleSwitcher", () => {
  it("links to the same page in every locale", () => {
    render(<LocaleSwitcher current="fr" label="Langue" />);

    expect(screen.getByRole("link", { name: "EN, English" })).toHaveAttribute("href", "/en/notes");
    expect(screen.getByRole("link", { name: "DE, Deutsch" })).toHaveAttribute("href", "/de/notes");
  });

  it("marks only the current locale", () => {
    render(<LocaleSwitcher current="fr" label="Langue" />);

    expect(screen.getByRole("link", { name: "FR, Français" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "EN, English" })).not.toHaveAttribute("aria-current");
  });

  it("is a labelled navigation landmark", () => {
    render(<LocaleSwitcher current="fr" label="Langue" />);

    expect(screen.getByRole("navigation", { name: "Langue" })).toBeInTheDocument();
  });
});
