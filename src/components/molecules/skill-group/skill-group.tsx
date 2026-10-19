import { Heading } from "@/components/atoms/heading";

type SkillGroupProps = {
  title: string;
  items: readonly string[];
};

/** One row of the skills line-up: the group at the left, its items running across the rest. */
export function SkillGroup({ title, items }: SkillGroupProps) {
  return (
    <div className="grid gap-2 md:grid-cols-12 md:gap-6">
      <Heading level={3} size="lg" className="text-[length:inherit] font-semibold md:col-span-4">
        {title}
      </Heading>
      <p className="md:col-span-8">{items.join(", ")}</p>
    </div>
  );
}
