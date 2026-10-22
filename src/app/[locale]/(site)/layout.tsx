import { SiteFooter } from "@/components/organisms/site-footer";
import { getMessages, isLocale } from "@/lib/i18n";
import { cvHref } from "@/server/infrastructure/cv";

/** The pages that end on the site footer. A project page is a story with its own ending, and no footer. */
export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) return children;
  const messages = await getMessages(locale);

  return (
    <>
      {children}
      <SiteFooter
        locale={locale}
        nav={messages.header.nav}
        cv={{ label: messages.home.cv, href: await cvHref(locale) }}
        availability={messages.home.contact.availability}
        messages={messages.footer}
      />
    </>
  );
}
