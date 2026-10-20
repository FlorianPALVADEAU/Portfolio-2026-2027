import { Award } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Pop } from "@/components/atoms/pop";
import { Text } from "@/components/atoms/text";

type CertificationListProps = {
  items: readonly {
    id: string;
    name: string;
    issuer: string;
    year: number;
    score: string | null;
  }[];
};

const STAGGER_SECONDS = 0.15;

/** One card per credential: the issuer and year, the name, and the score when one is published. */
export function CertificationList({ items }: CertificationListProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
      {items.map((item, order) => (
        <li key={item.id}>
          <Pop from="scale" delay={0.25 + order * STAGGER_SECONDS} className="h-full">
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-border bg-surface p-5 transition-[translate,border-color,box-shadow] duration-(--duration-base) hover:-translate-y-1 hover:border-accent hover:shadow-lg md:min-h-64 md:p-6">
              <div className="flex items-center justify-between">
                <Icon icon={Award} size="lg" className="text-accent" />
                <Text as="span" size="sm" tone="muted" className="font-mono">
                  {`${item.issuer} · ${item.year}`}
                </Text>
              </div>
              <div className="flex flex-col gap-1">
                {item.score && (
                  <p className="text-5xl font-semibold tracking-tighter text-accent tabular-nums">
                    {item.score}
                  </p>
                )}
                <p className="text-xl font-semibold text-pretty">{item.name}</p>
              </div>
            </div>
          </Pop>
        </li>
      ))}
    </ul>
  );
}
