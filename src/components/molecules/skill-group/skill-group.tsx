import { Badge } from "@/components/atoms/badge";
import { Heading } from "@/components/atoms/heading";

type SkillGroupProps = {
  title: string;
  items: readonly string[];
};

export function SkillGroup({ title, items }: SkillGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <Heading level={3} size="xl">
        {title}
      </Heading>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <Badge variant="outline">{item}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
