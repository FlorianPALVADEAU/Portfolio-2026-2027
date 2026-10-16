import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/atoms/section";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";

export function Home() {
  return (
    <main>
      <Section>
        <Container>
          <Stack gap="sm">
            <Heading level={1} size="display">
              Florian Palvadeau
            </Heading>
            <Text tone="muted">Full-stack software engineer</Text>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
