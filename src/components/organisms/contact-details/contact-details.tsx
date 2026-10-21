import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Text } from "@/components/atoms/text";
import { LocalTime } from "@/components/molecules/local-time";
import type { Locale, Messages } from "@/lib/i18n";

type ContactDetailsProps = {
  locale: Locale;
  messages: Messages["home"]["contact"]["details"];
  /** IANA zone of the place the map shows. */
  timeZone: string;
  /** Phone number as it is read; without it the line is left out. */
  phone: string | undefined;
};

/** The city, not a street: wide enough to show the lake, centred on Geneva. */
const MAP =
  "https://www.openstreetmap.org/export/embed.html?bbox=5.95%2C46.12%2C6.35%2C46.32&layer=mapnik&marker=46.2044%2C6.1432";

/** The dialled form of a number as people write it, which `tel:` links accept. */
const dialled = (phone: string) => phone.replace(/[^\d+]/g, "");

/**
 * Where to find the owner: the city on a grey map, the time there now and, when one is given,
 * a phone number. The map frame is lazy, so OpenStreetMap is asked only near the viewport.
 */
export function ContactDetails({ locale, messages, timeZone, phone }: ContactDetailsProps) {
  return (
    <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-12">
      <div className="flex flex-col gap-8 md:col-span-5">
        <div className="flex flex-col gap-4">
          <Heading level={3} size="xl">
            {messages.title}
          </Heading>
          <Text tone="muted" className="max-w-[40ch]">
            {messages.text}
          </Text>
        </div>
        <dl className="flex flex-col font-mono text-sm tracking-widest uppercase">
          <div className="flex items-baseline justify-between gap-4 border-t border-border py-3">
            <dt className="text-muted-foreground">{messages.time}</dt>
            <dd>
              <LocalTime locale={locale} timeZone={timeZone} />
            </dd>
          </div>
          {phone && (
            <div className="flex items-baseline justify-between gap-4 border-t border-border py-3">
              <dt className="text-muted-foreground">{messages.phone}</dt>
              <dd>
                <Link href={`tel:${dialled(phone)}`} className="no-underline">
                  {phone}
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </div>
      <iframe
        src={MAP}
        title={messages.map}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-[22rem] w-full border border-muted-foreground grayscale contrast-125 md:col-span-6 md:col-start-7 md:h-[26rem]"
      />
    </div>
  );
}
