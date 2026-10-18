import Image from "next/image";
import { Badge } from "@/components/atoms/badge";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";
import { type Block, BlockList } from "@/components/organisms/block-list";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";

type ProjectDetailProps = {
  locale: Locale;
  messages: Messages["project"];
  project: {
    title: string;
    summary: string;
    role: string;
    year: number;
    cover: { src: string; width: number; height: number; alt: string };
    blocks: readonly Block[];
  };
};

export function ProjectDetail({ locale, messages, project }: ProjectDetailProps) {
  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <Section>
        <Container>
          <Stack gap="lg">
            <Stack gap="sm">
              <Link href={`/${locale}`} className="inline-flex min-h-11 items-center text-sm">
                {messages.back}
              </Link>
              <Heading level={1} size="display">
                {project.title}
              </Heading>
              <Text tone="muted" size="lg" className="max-w-prose">
                {project.summary}
              </Text>
              <Stack direction="row" gap="xs">
                <Badge variant="outline">{`${messages.role}: ${project.role}`}</Badge>
                <Badge variant="outline">{`${messages.year}: ${project.year}`}</Badge>
              </Stack>
            </Stack>
            <Image
              src={project.cover.src}
              width={project.cover.width}
              height={project.cover.height}
              alt={project.cover.alt}
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="h-auto w-full rounded-lg border border-border"
            />
            <BlockList blocks={project.blocks} />
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
