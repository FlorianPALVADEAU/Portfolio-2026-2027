"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import type { Messages } from "@/lib/i18n";

type BookingFacadeProps = {
  messages: Messages["home"]["contact"]["booking"];
  /** Calendly event page; without it nothing is rendered. */
  url: string | undefined;
};

/** Calendly needs the embedding host to accept the inline frame. */
function embedUrl(url: string): string {
  const frame = new URL(url);
  frame.searchParams.set("embed_domain", window.location.hostname);
  frame.searchParams.set("embed_type", "Inline");
  return frame.toString();
}

/**
 * Booking block that stays a plain button until asked: Calendly is a third party, so nothing is
 * requested from it before the click.
 */
export function BookingFacade({ messages, url }: BookingFacadeProps) {
  const [source, setSource] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (source) frame.current?.focus();
  }, [source]);

  if (!url) return null;

  return (
    <div className="grid gap-10 border-t border-border pt-10 md:grid-cols-12">
      <div className="flex flex-col items-start gap-4 md:col-span-5">
        <Heading level={3} size="2xl">
          {messages.title}
        </Heading>
        <Text tone="muted" className="max-w-[40ch]">
          {messages.text}
        </Text>
        {!source && (
          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
            onClick={() => setSource(embedUrl(url))}
          >
            {messages.action}
          </Button>
        )}
      </div>
      {source && (
        <iframe
          ref={frame}
          src={source}
          title={messages.frame}
          className="h-[44rem] w-full border border-muted-foreground bg-surface md:col-span-6 md:col-start-7"
        />
      )}
    </div>
  );
}
