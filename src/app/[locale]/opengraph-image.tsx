import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { OgImage } from "@/components/templates/og-image";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteName;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { home } = await getMessages(locale);

  return new ImageResponse(<OgImage name={siteName} role={home.role} badge={home.badge} />, size);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
