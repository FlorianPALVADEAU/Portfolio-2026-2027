import { notFound } from "next/navigation";
import { PersonSchema } from "@/components/organisms/person-schema";
import { Home } from "@/components/templates/home";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <>
      <PersonSchema locale={locale} jobTitle={messages.home.role} />
      <Home locale={locale} messages={messages.home} />
    </>
  );
}
