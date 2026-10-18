import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/templates/project-detail";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { languageAlternates, openGraphLocale } from "@/lib/seo";
import { loadProject, projectSlugs } from "@/server/infrastructure/content";

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

async function findProject(params: Promise<{ locale: string; slug: string }>) {
  const { locale, slug } = await params;
  if (!(isLocale(locale) && projectSlugs.includes(slug))) notFound();
  return { locale, slug, project: await loadProject(slug, locale) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug, project } = await findProject(params);
  const path = `/projects/${slug}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/${locale}${path}`,
      locale: openGraphLocale(locale),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, project } = await findProject(params);
  const messages = await getMessages(locale);

  return <ProjectDetail locale={locale} messages={messages.project} project={project} />;
}
