import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { Document } from "@/components/templates/document";
import { GridOverlay } from "@/features/grid-overlay";
import { RouteFocus } from "@/features/route-focus";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = await getMessages(locale);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <Document lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <SiteHeader locale={locale} messages={messages.header} />
      {children}
      <SiteFooter />
      <RouteFocus />
      {process.env.NODE_ENV === "development" && <GridOverlay />}
    </Document>
  );
}
