import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";

type LinksBlockProps = {
  title: string;
  items: readonly { id: string; href: string }[];
  labels: Readonly<Record<string, string>>;
};

export function LinksBlock({ title, items, labels }: LinksBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <Heading level={2} className="md:col-span-4">
        {title}
      </Heading>
      <ul className="flex flex-col gap-2 md:col-span-7 md:col-start-6">
        {items.map(({ id, href }) => (
          <li key={id}>
            <Link
              href={href}
              external
              className="inline-flex min-h-11 items-center text-[clamp(1.25rem,2.1vw,1.875rem)]"
            >
              {labels[id] ?? id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
