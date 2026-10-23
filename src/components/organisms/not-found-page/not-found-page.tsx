import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";

type NotFoundPageProps = {
  /** One entry per language: an unknown URL says nothing about which one the visitor reads. */
  entries: readonly { locale: Locale; messages: Messages["status"] }[];
};

export function NotFoundPage({ entries }: NotFoundPageProps) {
  return (
    <main id={MAIN_ID}>
      <Container className="flex min-h-svh flex-col items-start justify-center gap-12 py-24">
        {entries.map(({ locale, messages }, index) => (
          <section key={locale} lang={locale} className="flex flex-col items-start gap-4">
            <Heading level={index === 0 ? 1 : 2} size={index === 0 ? "display" : "2xl"}>
              {messages.notFound.title}
            </Heading>
            <Text tone="muted" className="max-w-prose">
              {messages.notFound.body}
            </Text>
            <Link href={`/${locale}`}>{messages.home}</Link>
          </section>
        ))}
      </Container>
    </main>
  );
}
