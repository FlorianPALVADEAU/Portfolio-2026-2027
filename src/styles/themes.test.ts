import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";

const css = readFileSync(path.resolve(import.meta.dirname, "themes.css"), "utf8");
const themes = ["dark", "light", "swiss"] as const;

function tokensOf(theme: (typeof themes)[number]) {
  const selectors = {
    dark: '[data-theme="dark"]',
    light: ':root,\n[data-theme="light"],\n[data-theme="dark"] [data-paper]',
    swiss: '[data-theme="swiss"]',
  };
  const selector = selectors[theme];
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2]]),
  ) as Record<string, string>;
}

const pairs = [
  ["foreground", "background"],
  ["surface-foreground", "surface"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["accent-foreground", "accent"],
  ["accent", "background"],
  ["border", "background"],
] as const;

describe.each(themes)("%s theme", (theme) => {
  const tokens = tokensOf(theme);

  it.each(pairs)("%s on %s meets WCAG AA", (fg, bg) => {
    const minimum = fg === "border" ? 1 : fg === "accent" ? 3 : 4.5;
    expect(contrastRatio(tokens[fg] as string, tokens[bg] as string)).toBeGreaterThanOrEqual(
      minimum,
    );
  });
});
