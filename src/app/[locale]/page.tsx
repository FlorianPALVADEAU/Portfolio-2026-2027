import { notFound } from "next/navigation";
import { PersonSchema } from "@/components/organisms/person-schema";
import { Home } from "@/components/templates/home";
import { getMessages, isLocale } from "@/lib/i18n";
import { loadProject, projectSlugs } from "@/server/infrastructure/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = await getMessages(locale);
  const projects = await Promise.all(projectSlugs.map((slug) => loadProject(slug, locale)));
  if (projects.length === 0) throw new Error("The landing page needs at least one project");

  return (
    <>
      <PersonSchema locale={locale} jobTitle={messages.home.role} />
      <Home locale={locale} messages={messages.home} projects={projects} />
    </>
  );
}
