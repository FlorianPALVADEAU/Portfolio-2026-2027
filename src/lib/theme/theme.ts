export const themes = ["dark", "light", "swiss"] as const;
export type Theme = (typeof themes)[number];
export const defaultTheme: Theme = "light";
const THEME_STORAGE_KEY = "theme";

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value);
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked; the theme still applies for this visit.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/**
 * Runs before first paint so a stored theme never flashes the default one. It is the only writer of
 * the initial `data-theme`: the attribute is not in the server markup, because React would reset it
 * whenever a locale change re-renders the root layout.
 */
export const themeInitScript = `var t=${JSON.stringify(defaultTheme)};try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(themes)}.indexOf(s)>-1)t=s}catch(e){}document.documentElement.dataset.theme=t;`;
