import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeSwitcher } from "./theme-switcher";

const names = { dark: "Dark", light: "Light", swiss: "Swiss" };

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("ThemeSwitcher", () => {
  it("names the current theme, light by default", () => {
    render(<ThemeSwitcher label="Theme" names={names} />);

    expect(screen.getByRole("button", { name: "Theme: Light" })).toBeInTheDocument();
  });

  it("lists the three themes and applies and persists the chosen one", async () => {
    render(<ThemeSwitcher label="Theme" names={names} />);

    await userEvent.click(screen.getByRole("button", { name: "Theme: Light" }));
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Swiss" }));

    expect(document.documentElement.dataset.theme).toBe("swiss");
    expect(localStorage.getItem("theme")).toBe("swiss");
    expect(screen.getByRole("button", { name: "Theme: Swiss" })).toBeInTheDocument();
  });

  it("restores the stored theme", async () => {
    localStorage.setItem("theme", "dark");
    render(<ThemeSwitcher label="Theme" names={names} />);

    expect(await screen.findByRole("button", { name: "Theme: Dark" })).toBeInTheDocument();
  });
});
