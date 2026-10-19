import { beforeEach, describe, expect, it } from "vitest";
import { applyTheme, readStoredTheme, storeTheme, themeInitScript } from "./theme";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("theme storage", () => {
  it("round-trips a valid theme", () => {
    storeTheme("swiss");
    expect(readStoredTheme()).toBe("swiss");
  });

  it("ignores an unknown stored value", () => {
    localStorage.setItem("theme", "neon");
    expect(readStoredTheme()).toBeNull();
  });
});

describe("applyTheme", () => {
  it("sets data-theme on the root element", () => {
    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("themeInitScript", () => {
  it("applies a stored theme", () => {
    localStorage.setItem("theme", "light");
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("falls back to the default when the stored value is invalid", () => {
    localStorage.setItem("theme", "neon");
    new Function(themeInitScript)();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
