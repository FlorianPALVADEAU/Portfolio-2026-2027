import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";
import type { Locale, Messages } from "@/lib/i18n";

type HeroSectionProps = {
  locale: Locale;
  messages: Pick<Messages["home"], "badge" | "role" | "cta">;
};

export function HeroSection({ locale, messages }: HeroSectionProps) {
  return (
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
  );
}
