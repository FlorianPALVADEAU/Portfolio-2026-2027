import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectSchema } from "@/components/organisms/project-schema";
import { ProjectDetail } from "@/components/templates/project-detail";
import { getMessages, isLocale, locales } from "@/lib/i18n";
import { languageAlternates, openGraphLocale } from "@/lib/seo";
import { siteName } from "@/lib/site";
import { loadProject, projectSlugs } from "@/server/infrastructure/content";
import { cvHref } from "@/server/infrastructure/cv";

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
  const image = {
    url: project.cover.src,
    width: project.cover.width,
    height: project.cover.height,
    alt: project.cover.alt,
  };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    // A page's `openGraph` replaces the layout's whole object, so the site fields are repeated here.
    openGraph: {
      type: "article",
      siteName,
      title: project.title,
      description: project.summary,
      url: `/${locale}${path}`,
      locale: openGraphLocale(locale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [image.url],
    },
  };
}

/** The project that follows this one in the list, wrapping around; `null` when it is alone. */
async function findNext(locale: (typeof locales)[number], slug: string) {
  const following = projectSlugs[(projectSlugs.indexOf(slug) + 1) % projectSlugs.length];
  if (!following || following === slug) return null;
  const { title } = await loadProject(following, locale);
  return { slug: following, title };
}

async function ProjectContent({
  params,
}: {
  params: PageProps<"/[locale]/projects/[slug]">["params"];
}) {
  const { locale, slug, project } = await findProject(params);
  const [messages, next, cv] = await Promise.all([
    getMessages(locale),
    findNext(locale, slug),
    cvHref(locale),
  ]);

  return (
    <>
      <ProjectSchema locale={locale} project={project} />
      <ProjectDetail
        locale={locale}
        messages={messages.project}
        playerLabels={messages.player}
        next={next}
        cvHref={cv}
        project={project}
      />
    </>
  );
}

// Reading `params` ties a route's shell to one URL; behind Suspense the shell stays shared.
export default function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ProjectContent params={params} />
    </Suspense>
  );
}
