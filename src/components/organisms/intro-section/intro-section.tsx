import Image from "next/image";
import { Text } from "@/components/atoms/text";
import { LandingSection } from "@/components/organisms/landing-section";
import type { Messages } from "@/lib/i18n";

type IntroSectionProps = {
  title: string;
  messages: Messages["home"]["intro"];
  photo: Messages["home"]["photos"]["panorama"];
};

export function IntroSection({ title, messages, photo }: IntroSectionProps) {
  return (
    <LandingSection id="intro" title={title} tone="clear">
      <div className="grid gap-8 md:grid-cols-12">
        <p className="max-w-[28ch] text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-medium tracking-tight md:col-span-7">
          {messages.statement}
        </p>
        <Text className="md:col-span-4 md:col-start-9">{messages.aside}</Text>
      </div>
      <figure className="-mx-(--gutter) m-0">
        <Image
          src="/photos/lavaux-terraces.jpg"
          alt={photo.alt}
          width={1920}
          height={1080}
          sizes="100vw"
          className="aspect-[4/5] w-full object-cover md:aspect-[21/9]"
        />
        <figcaption className="px-(--gutter) pt-3 text-sm">{photo.caption}</figcaption>
      </figure>
    </LandingSection>
  );
}
