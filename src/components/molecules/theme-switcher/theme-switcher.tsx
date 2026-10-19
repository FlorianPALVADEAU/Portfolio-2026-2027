"use client";

import { Check, Moon, Plus, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/atoms/icon";
import { Dropdown } from "@/components/molecules/dropdown";
import {
  applyTheme,
  defaultTheme,
  readStoredTheme,
  storeTheme,
  type Theme,
  themes,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const glyphs = { dark: Moon, light: Sun, swiss: Plus } as const;

type ThemeSwitcherProps = {
  label: string;
  names: Record<Theme, string>;
};

export function ThemeSwitcher({ label, names }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = readStoredTheme() ?? defaultTheme;
    setTheme(stored);
    // A locale change swaps the root layout, and the new <html> comes without the attribute.
    applyTheme(stored);
  }, []);

  function select(next: Theme) {
    setTheme(next);
    applyTheme(next);
    storeTheme(next);
  }

  return (
    <Dropdown label={`${label}: ${names[theme]}`} trigger={<Icon icon={glyphs[theme]} />}>
      <ul>
        {themes.map((value) => (
          <li key={value}>
            <button
              type="button"
              aria-pressed={theme === value}
              onClick={() => select(value)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md px-3 text-sm hover:bg-muted",
                theme === value ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon icon={glyphs[value]} size="sm" />
              <span className="flex-1 text-left">{names[value]}</span>
              {theme === value && <Icon icon={Check} size="sm" />}
            </button>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
