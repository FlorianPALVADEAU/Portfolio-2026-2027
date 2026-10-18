"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/atoms/button";
import { type Locale, localeNames, locales, localizePath } from "@/lib/i18n";
import {
  getServerSoundEnabled,
  getSoundEnabled,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/sound";
import { applyTheme, storeTheme, type Theme, themes } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { type Command, filterCommands } from "./commands";

type CommandPaletteProps = {
  locale: Locale;
  themeNames: Record<Theme, string>;
  messages: {
    trigger: string;
    title: string;
    placeholder: string;
    empty: string;
    home: string;
    theme: string;
    language: string;
    soundOn: string;
    soundOff: string;
  };
};

/** Keyboard-first command menu on a native modal dialog, which traps focus and restores it on close. */
export function CommandPalette({ locale, themeNames, messages }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const soundEnabled = useSyncExternalStore(subscribeSound, getSoundEnabled, getServerSoundEnabled);

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", label: messages.home, run: () => router.push(`/${locale}`) },
      ...themes.map((theme) => ({
        id: `theme-${theme}`,
        label: `${messages.theme}: ${themeNames[theme]}`,
        run: () => {
          applyTheme(theme);
          storeTheme(theme);
        },
      })),
      ...locales
        .filter((target) => target !== locale)
        .map((target) => ({
          id: `locale-${target}`,
          label: `${messages.language}: ${localeNames[target]}`,
          run: () => router.push(localizePath(pathname, target)),
        })),
      {
        id: "sound",
        label: soundEnabled ? messages.soundOff : messages.soundOn,
        run: () => setSoundEnabled(!soundEnabled),
      },
    ],
    [locale, messages, pathname, router, soundEnabled, themeNames],
  );
  const results = filterCommands(commands, query);
  const activeCommand = results[active];

  const open = useCallback(() => {
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialog.current?.close();
  }, []);

  function run(command: Command | undefined) {
    if (!command) return;
    close();
    command.run();
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((active + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((active - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(activeCommand);
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="min-h-11" onClick={open}>
        {messages.trigger}
      </Button>
      <dialog
        ref={dialog}
        aria-label={messages.title}
        onPointerDown={(event) => {
          if (event.target === dialog.current) close();
        }}
        className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-lg border border-border bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        <input
          ref={input}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeCommand ? `${listId}-${activeCommand.id}` : undefined}
          aria-label={messages.placeholder}
          placeholder={messages.placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKeyDown}
          className="min-h-12 w-full border-0 border-b border-border bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground"
        />
        <div
          id={listId}
          role="listbox"
          aria-label={messages.title}
          className="max-h-72 overflow-y-auto p-2"
        >
          {results.map((command, index) => (
            <div
              key={command.id}
              id={`${listId}-${command.id}`}
              role="option"
              aria-selected={index === active}
              onPointerMove={() => setActive(index)}
              tabIndex={-1}
              onPointerUp={() => run(command)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center rounded-md px-3 text-sm",
                index === active ? "bg-surface text-foreground" : "text-muted-foreground",
              )}
            >
              {command.label}
            </div>
          ))}
        </div>
        {results.length === 0 && (
          <p role="status" className="m-0 px-4 py-3 text-sm text-muted-foreground">
            {messages.empty}
          </p>
        )}
      </dialog>
    </>
  );
}
