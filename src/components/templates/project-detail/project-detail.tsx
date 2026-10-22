import Image from "next/image";
import { Container } from "@/components/atoms/container";
import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Section } from "@/components/atoms/section";
import { Stack } from "@/components/atoms/stack";
import { Text } from "@/components/atoms/text";
import { type Block, BlockList } from "@/components/organisms/block-list";
import { Entrance } from "@/features/entrance";
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
            <Entrance className="flex flex-col gap-4">
              <Heading level={1} size="display" className="text-[clamp(3rem,11vw,10rem)]">
                {project.title}
              </Heading>
              <Text data-entrance size="lg" className="max-w-prose">
                {project.summary}
              </Text>
              <Text
                data-entrance
              >{`${messages.role}: ${project.role} · ${messages.year}: ${project.year}`}</Text>
              <div data-entrance>
                <Link
                  href={`/${locale}`}
                  data-restore-scroll=""
                  data-keep-scroll=""
                  data-no-cover=""
                  className="inline-flex min-h-11 items-center"
                >
                  {messages.back}
                </Link>
              </div>
            </Entrance>
            <Image
              src={project.cover.src}
              width={project.cover.width}
              height={project.cover.height}
              alt={project.cover.alt}
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="h-auto w-full"
            />
            <BlockList blocks={project.blocks} />
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
