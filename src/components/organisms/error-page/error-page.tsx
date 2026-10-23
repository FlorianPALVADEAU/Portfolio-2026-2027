"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusPage } from "@/components/organisms/status-page";
import { getMessages, isLocale, type Locale, type Messages } from "@/lib/i18n";

const FALLBACK_LOCALE: Locale = "en";

/**
 * The page shown when a route breaks. Next gives an error boundary no props, so the locale comes
 * from the URL and the strings load on demand: a healthy page never pays for them.
 */
export function ErrorPage({ retry }: { retry: () => void }) {
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

  if (!status) return null;
  return (
    <StatusPage locale={locale} code="Err" copy={status.error} labels={status} retry={retry} />
  );
}
