import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";

type HomeProps = {
  locale: Locale;
  messages: Messages["home"];
};

export function Home({ locale, messages }: HomeProps) {
  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <Section>
        <Container>
          <Stack gap="sm">
            <Badge variant="outline">{messages.badge}</Badge>
            <Heading level={1} size="display">
              Florian Palvadeau
            </Heading>
            <Text tone="muted">{messages.role}</Text>
            <Stack direction="row" gap="sm">
              <Button asChild>
                <Link
                  href={`/${locale}#contact`}
                  className="no-underline hover:text-accent-foreground"
                >
                  {messages.cta}
                </Link>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
