"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import type { Messages } from "@/lib/i18n";

type BookingEmbedProps = {
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
 * The calendar, open on the page so a visitor can pick a slot without another click. The frame
 * is lazy: the browser requests Calendly only when it nears the viewport, so the third party is
 * never contacted by visitors who stop above the contact section.
 */
export function BookingEmbed({ messages, url }: BookingEmbedProps) {
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    if (url) setSource(embedUrl(url));
  }, [url]);

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
      </div>
      <div className="h-[44rem] border border-muted-foreground bg-surface md:col-span-6 md:col-start-7">
        {source && (
          <iframe
            src={source}
            title={messages.frame}
            loading="lazy"
            className="size-full border-0"
          />
        )}
      </div>
    </div>
  );
}
