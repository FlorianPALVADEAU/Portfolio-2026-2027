import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { Document } from "@/components/templates/document";
import { Analytics } from "@/features/analytics";
import { BackgroundMusic } from "@/features/background-music";
import { GridOverlay } from "@/features/grid-overlay";
import { PageTransition } from "@/features/page-transition";
import { RouteFocus } from "@/features/route-focus";
import { SmoothScroll } from "@/features/smooth-scroll";
import { UiSound } from "@/features/ui-sound";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { languageAlternates, openGraphLocale } from "@/lib/seo";
import { siteName, siteUrl } from "@/lib/site";
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
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${locale}`, languages: languageAlternates() },
    openGraph: {
      type: "website",
      siteName,
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      locale: openGraphLocale(locale),
      alternateLocale: locales.filter((l) => l !== locale).map(openGraphLocale),
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <Document lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <SiteHeader locale={locale} messages={messages.header} palette={messages.palette} />
      {children}
      <SiteFooter locale={locale} nav={messages.header.nav} messages={messages.footer} />
      <RouteFocus />
      <SmoothScroll />
      <PageTransition />
      <UiSound />
      <BackgroundMusic />
      <Analytics />
      {process.env.NODE_ENV === "development" && <GridOverlay />}
    </Document>
  );
}
