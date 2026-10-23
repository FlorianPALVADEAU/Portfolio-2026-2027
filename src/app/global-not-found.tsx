import { NotFoundPage } from "@/components/organisms/not-found-page";
import { Document } from "@/components/templates/document";
import { defaultLocale, getMessages, locales } from "@/lib/i18n";
import { fontVariables } from "./fonts";
import "./globals.css";

export default async function GlobalNotFound() {
  // The default language leads, so it carries the page's main heading.
  const ordered = [defaultLocale, ...locales.filter((locale) => locale !== defaultLocale)];
  const entries = await Promise.all(
    ordered.map(async (locale) => ({ locale, messages: (await getMessages(locale)).status })),
  );

  return (
    <Document lang="en" className={fontVariables}>
      <NotFoundPage entries={entries} />
    </Document>
  );
}
