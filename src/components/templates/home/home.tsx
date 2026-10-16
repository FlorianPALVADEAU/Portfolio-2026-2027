import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

export function Home() {
  return (
    <main>
      <Heading level={1} size="display">
        Florian Palvadeau
      </Heading>
      <Text tone="muted">Full-stack software engineer</Text>
    </main>
  );
}
