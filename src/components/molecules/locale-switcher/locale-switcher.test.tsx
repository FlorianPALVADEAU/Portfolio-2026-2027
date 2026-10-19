import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LocaleSwitcher } from "./locale-switcher";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/notes" }));

async function open() {
  render(<LocaleSwitcher current="fr" label="Langue" />);
  await userEvent.click(screen.getByRole("button", { name: "Langue: Français" }));
}

describe("LocaleSwitcher", () => {
  it("shows only the current locale until opened", async () => {
    render(<LocaleSwitcher current="fr" label="Langue" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Langue: Français" }));
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("links to the same page in every locale", async () => {
    await open();

    expect(screen.getByRole("link", { name: "EN, English" })).toHaveAttribute("href", "/en/notes");
    expect(screen.getByRole("link", { name: "DE, Deutsch" })).toHaveAttribute("href", "/de/notes");
  });

  it("marks only the current locale", async () => {
    await open();

    expect(screen.getByRole("link", { name: "FR, Français" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "EN, English" })).not.toHaveAttribute("aria-current");
  });

  it("closes on Escape", async () => {
    await open();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
