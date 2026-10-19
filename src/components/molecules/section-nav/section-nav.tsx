import { Link } from "@/components/atoms/link";

type SectionNavProps = {
  label: string;
  items: readonly { href: string; label: string }[];
};

export function SectionNav({ label, items }: SectionNavProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap items-center gap-x-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-11 items-center text-sm no-underline hover:text-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
