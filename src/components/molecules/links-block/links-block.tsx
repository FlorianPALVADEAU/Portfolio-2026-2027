import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";

type LinksBlockProps = {
  title: string;
  items: readonly { id: string; href: string }[];
  labels: Readonly<Record<string, string>>;
};

export function LinksBlock({ title, items, labels }: LinksBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={2} size="xl">
        {title}
      </Heading>
      <ul className="flex flex-col gap-1">
        {items.map(({ id, href }) => (
          <li key={id}>
            <Link href={href} external className="inline-flex min-h-11 items-center text-base">
              {labels[id] ?? id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
