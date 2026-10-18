"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  defaultTheme,
  readStoredTheme,
  storeTheme,
  type Theme,
  themes,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

type ThemeSwitcherProps = {
  label: string;
  names: Record<Theme, string>;
};

export function ThemeSwitcher({ label, names }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    setTheme(readStoredTheme() ?? defaultTheme);
  }, []);

  function select(next: Theme) {
    setTheme(next);
    applyTheme(next);
    storeTheme(next);
  }

  return (
    <fieldset className="m-0 flex items-center gap-1 border-0 p-0">
      <legend className="sr-only">{label}</legend>
      {themes.map((value) => (
        <label
          key={value}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center rounded-md px-3 text-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
            theme === value ? "bg-surface text-foreground" : "text-muted-foreground",
          )}
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={theme === value}
            onChange={() => select(value)}
            className="sr-only"
          />
          {names[value]}
        </label>
      ))}
    </fieldset>
  );
}
