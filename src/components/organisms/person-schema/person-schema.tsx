import { JsonLd } from "@/components/atoms/json-ld";
import type { Locale } from "@/lib/i18n";
import { personJsonLd } from "@/lib/seo";

type PersonSchemaProps = {
  locale: Locale;
  jobTitle: string;
};

export function PersonSchema({ locale, jobTitle }: PersonSchemaProps) {
  return <JsonLd data={personJsonLd(locale, jobTitle)} />;
}
