"use client";

import Script from "next/script";
import { type RefObject, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileFieldProps = {
  siteKey: string;
  /** Names the surface being protected; the server checks it matches. */
  action: string;
  label: string;
  /** Cloudflare's script is only fetched once this is true, so visitors who never write load nothing. */
  load: boolean;
  /** Change this value to get a fresh challenge, since a token works only once. */
  resetKey: unknown;
};

/**
 * Turnstile has no Swiss look; the Swiss theme is white, so it takes the light one. So does a
 * dark page on paper, where the field sits inside a `data-paper` ancestor.
 */
function useSiteTheme(field: RefObject<HTMLElement | null>): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(
        root.dataset.theme === "dark" && !field.current?.closest("[data-paper]") ? "dark" : "light",
      );
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [field]);

  return theme;
}

/**
 * Cloudflare Turnstile challenge. The widget adds the `cf-turnstile-response` field to the
 * enclosing form by itself.
 */
export function TurnstileField({ siteKey, action, label, load, resetKey }: TurnstileFieldProps) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  const theme = useSiteTheme(container);

  useEffect(() => {
    const mount = () => {
      if (!(container.current && window.turnstile) || widget.current) return;
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action,
        theme,
      });
    };
    mount();
    window.addEventListener("turnstile-ready", mount);
    return () => {
      window.removeEventListener("turnstile-ready", mount);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, action, theme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `resetKey` only signals a reset.
  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  return (
    <>
      {load && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => {
            window.dispatchEvent(new Event("turnstile-ready"));
          }}
        />
      )}
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{label}</legend>
        <div ref={container} />
      </fieldset>
    </>
  );
}
