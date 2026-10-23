import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusPage } from "@/components/organisms/status-page";
import { getMessages, isLocale, locales } from "@/lib/i18n";

/** Reached only through the proxy, which sets the 404 status; see `isKnownPath`. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/404">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { status } = await getMessages(locale);
  return { title: status.notFound.kicker, robots: { index: false, follow: false } };
}

export default async function NotFoundPage({ params }: PageProps<"/[locale]/404">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { status } = await getMessages(locale);

  return <StatusPage locale={locale} code="404" copy={status.notFound} labels={status} />;
}
