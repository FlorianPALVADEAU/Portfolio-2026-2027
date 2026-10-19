"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

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
  /** Change this value to get a fresh challenge, since a token works only once. */
  resetKey: unknown;
};

/**
 * Cloudflare Turnstile challenge. The widget adds the `cf-turnstile-response` field to the
 * enclosing form by itself.
 */
export function TurnstileField({ siteKey, action, label, resetKey }: TurnstileFieldProps) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    const mount = () => {
      if (!(container.current && window.turnstile) || widget.current) return;
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action,
        theme: "auto",
      });
    };
    mount();
    window.addEventListener("turnstile-ready", mount);
    return () => {
      window.removeEventListener("turnstile-ready", mount);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, action]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `resetKey` only signals a reset.
  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => {
          window.dispatchEvent(new Event("turnstile-ready"));
        }}
      />
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{label}</legend>
        <div ref={container} />
      </fieldset>
    </>
  );
}
