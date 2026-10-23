"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";
import { MAIN_ID } from "@/features/route-focus";
import { getMessages, isLocale, type Locale, type Messages } from "@/lib/i18n";

type ErrorPageProps = {
  /** Renders the failed segment again. */
  retry: () => void;
};

const FALLBACK_LOCALE: Locale = "en";

/**
 * What the visitor sees when a page breaks, in their language. Next gives an error boundary no
 * props, so the locale comes from the URL and the strings load on demand: a healthy page never
 * pays for them.
 */
export function ErrorPage({ retry }: ErrorPageProps) {
  const { locale: segment } = useParams<{ locale?: string }>();
  const locale = segment && isLocale(segment) ? segment : FALLBACK_LOCALE;
  const [status, setStatus] = useState<Messages["status"] | null>(null);

  useEffect(() => {
    let current = true;
    getMessages(locale).then((messages) => {
      if (current) setStatus(messages.status);
    });
    return () => {
      current = false;
    };
  }, [locale]);

  if (!status) return <main id={MAIN_ID} className="min-h-svh" />;

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <Container className="flex min-h-svh flex-col items-start justify-center gap-6 py-24">
        <Text size="sm" tone="muted" className="font-mono uppercase tracking-widest">
          {status.error.code}
        </Text>
        <Heading level={1} size="display" className="max-w-3xl">
          {status.error.title}
        </Heading>
        <Text tone="muted" size="lg" className="max-w-prose">
          {status.error.body}
        </Text>
        <div className="flex flex-wrap items-center gap-6">
          <Button onClick={retry}>{status.retry}</Button>
          <Link href={`/${locale}`}>{status.home}</Link>
        </div>
      </Container>
    </main>
  );
}
