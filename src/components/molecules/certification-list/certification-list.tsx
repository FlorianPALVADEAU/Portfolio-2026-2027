import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type CertificationListProps = {
  title: string;
  items: readonly {
    id: string;
    name: string;
    issuer: string;
    year: number;
    score: string | null;
  }[];
};

export function CertificationList({ title, items }: CertificationListProps) {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={3} size="xl">
        {title}
      </Heading>
      <ul className="flex flex-col border-t border-border">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-border py-3"
          >
            <p className="font-semibold">
              {item.score ? `${item.name}, ${item.score}` : item.name}
            </p>
            <Text as="span" size="sm" tone="muted" className="font-mono">
              {`${item.issuer} · ${item.year}`}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
