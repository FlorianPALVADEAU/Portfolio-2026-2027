import { Heading } from "@/components/atoms/heading";

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
    <div className="grid gap-2 md:grid-cols-12 md:gap-6">
      <Heading level={3} size="lg" className="text-[length:inherit] font-semibold md:col-span-4">
        {title}
      </Heading>
      <ul className="flex flex-col gap-2 md:col-span-8">
        {items.map((item) => (
          <li key={item.id}>
            {`${item.score ? `${item.name}, ${item.score}` : item.name}: ${item.issuer}, ${item.year}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
