import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";

export function Home() {
  return (
    <main>
      <Section>
        <Container>
          <Stack gap="sm">
            <Badge variant="outline">Open to positions, Switzerland</Badge>
            <Heading level={1} size="display">
              Florian Palvadeau
            </Heading>
            <Text tone="muted">Full-stack software engineer</Text>
            <Stack direction="row" gap="sm">
              <Button asChild>
                <Link href="/" className="no-underline hover:text-accent-foreground">
                  Get in touch
                </Link>
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
