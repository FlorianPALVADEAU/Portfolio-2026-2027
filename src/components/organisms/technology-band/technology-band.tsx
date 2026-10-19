import { Marquee } from "@/features/marquee";
import type { Messages } from "@/lib/i18n";
import { technologies } from "@/lib/landing";

type TechnologyBandProps = {
  messages: Messages["home"]["marquee"];
};

export function TechnologyBand({ messages }: TechnologyBandProps) {
  return (
    <Marquee
      items={technologies}
      label={messages.label}
      pauseLabel={messages.pause}
      playLabel={messages.play}
    />
  );
}
