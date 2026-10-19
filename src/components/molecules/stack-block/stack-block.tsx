import { Heading } from "@/components/atoms/heading";

type StackBlockProps = {
  title: string;
  items: readonly string[];
};

export function StackBlock({ title, items }: StackBlockProps) {
  return (
    <div className="grid gap-6 md:grid-cols-12">
      <Heading level={2} className="md:col-span-4">
        {title}
      </Heading>
      <p className="text-[clamp(1.25rem,2.1vw,1.875rem)] md:col-span-7 md:col-start-6">
        {items.join(", ")}
      </p>
    </div>
  );
}
