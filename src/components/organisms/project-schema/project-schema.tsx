import { JsonLd } from "@/components/atoms/json-ld";
import type { Locale } from "@/lib/i18n";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/seo";
import { siteName } from "@/lib/site";

type ProjectSchemaProps = {
  locale: Locale;
  project: {
    slug: string;
    title: string;
    summary: string;
    year: number;
    stack: readonly string[];
    cover: { src: string };
  };
};

export function ProjectSchema({ locale, project }: ProjectSchemaProps) {
  return (
    <>
      <JsonLd data={projectJsonLd(locale, project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: siteName, path: `/${locale}` },
          { name: project.title, path: `/${locale}/projects/${project.slug}` },
        ])}
      />
    </>
  );
}
