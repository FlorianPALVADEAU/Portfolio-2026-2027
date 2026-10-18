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
  it("is a labelled radio group with dark selected by default", () => {
    render(<ThemeSwitcher label="Theme" names={names} />);

    expect(screen.getByRole("group", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked();
  });

  it("applies and persists the chosen theme", async () => {
    render(<ThemeSwitcher label="Theme" names={names} />);

    await userEvent.click(screen.getByRole("radio", { name: "Swiss" }));

    expect(document.documentElement.dataset.theme).toBe("swiss");
    expect(localStorage.getItem("theme")).toBe("swiss");
  });

  it("restores the stored theme", async () => {
    localStorage.setItem("theme", "light");
    render(<ThemeSwitcher label="Theme" names={names} />);

    expect(await screen.findByRole("radio", { name: "Light" })).toBeChecked();
  });
});
