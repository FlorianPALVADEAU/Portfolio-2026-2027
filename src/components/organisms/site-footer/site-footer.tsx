import { Container } from "@/components/atoms/container";
import { Text } from "@/components/atoms/text";

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-border bg-background">
      <Container className="py-6">
        <Text tone="muted" size="sm">
          © 2026 Florian Palvadeau
        </Text>
      </Container>
    </footer>
  );
}
