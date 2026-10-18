import { Heading } from "@/components/atoms/heading";
import { Link } from "@/components/atoms/link";
import { Stack } from "@/components/atoms/stack";

type LinksBlockProps = {
  title: string;
  items: readonly { id: string; href: string }[];
  labels: Readonly<Record<string, string>>;
};

export function LinksBlock({ title, items, labels }: LinksBlockProps) {
  return (
    <Stack gap="sm">
      <Heading level={2}>{title}</Heading>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map(({ id, href }) => (
          <li key={id}>
            <Link href={href} external className="inline-flex min-h-11 items-center">
              {labels[id] ?? id}
            </Link>
          </li>
        ))}
      </ul>
    </Stack>
  );
}
