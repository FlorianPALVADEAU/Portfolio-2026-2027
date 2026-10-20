import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";

type CertificationListProps = {
  items: readonly {
    id: string;
    name: string;
    issuer: string;
    year: number;
    score: string | null;
    logo: string;
    /** Public identifier a verifier asks for, when the issuer gives one. */
    credentialId: string | null;
    verifyUrl: string;
  }[];
  labels: { verify: string; credentialId: string };
};

const STAGGER_SECONDS = 0.15;

/**
 * One card per credential: the badge, issuer and year, the name and score, the identifier, and a
 * link to the issuer's page that checks it. The badge turns and grows on hover.
 */
export function CertificationList({ items, labels }: CertificationListProps) {
  return (
    <ul className="grid gap-3 md:grid-cols-3 md:gap-5">
      {items.map((item, order) => (
        <li key={item.id}>
          <Pop from="pop" delay={0.25 + order * STAGGER_SECONDS} className="h-full">
            <div className="group/cert flex h-full flex-col justify-between gap-2 rounded-3xl border border-border bg-surface p-3.5 md:gap-6 transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-1 hover:border-accent hover:shadow-lg md:min-h-72 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <Image
                  src={item.logo}
                  alt=""
                  width={80}
                  height={80}
                  unoptimized
                  className="size-12 rounded-xl transition-transform duration-(--duration-slow) ease-out-expo group-hover/cert:scale-110 group-hover/cert:-rotate-6 md:size-20"
                />
                <Text as="span" size="sm" tone="muted" className="font-mono">
                  {`${item.issuer} · ${item.year}`}
                </Text>
              </div>
              <div className="flex flex-col gap-2 md:gap-4">
                <div className="flex flex-col gap-1">
                  {item.score && (
                    <p className="text-3xl font-semibold tracking-tighter text-accent md:text-5xl tabular-nums">
                      {item.score}
                    </p>
                  )}
                  <p className="text-xl font-semibold text-pretty">{item.name}</p>
                </div>
                {item.credentialId && (
                  <p className="flex flex-wrap gap-x-2 font-mono text-xs break-all text-muted-foreground md:flex-col md:gap-x-0 md:gap-y-0.5">
                    <span>{labels.credentialId}</span>
                    <span className="text-foreground">{item.credentialId}</span>
                  </p>
                )}
                <Link
                  href={item.verifyUrl}
                  external
                  className="group/verify inline-flex w-fit items-center gap-1.5 text-sm font-medium"
                >
                  {labels.verify}
                  <Icon
                    icon={ArrowUpRight}
                    size="sm"
                    className="transition-transform duration-(--duration-base) group-hover/verify:translate-x-0.5 group-hover/verify:-translate-y-0.5"
                  />
                  <span className="sr-only">{`${item.name}, ${item.issuer}`}</span>
                </Link>
              </div>
            </div>
          </Pop>
        </li>
      ))}
    </ul>
  );
}
