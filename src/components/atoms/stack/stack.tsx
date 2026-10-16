import type { ComponentPropsWithoutRef } from "react";

const gaps = { xs: "gap-2", sm: "gap-4", md: "gap-6", lg: "gap-10", xl: "gap-16" } as const;

type StackProps = ComponentPropsWithoutRef<"div"> & {
  gap?: keyof typeof gaps;
  direction?: "column" | "row";
};

export function Stack({ gap = "md", direction = "column", className = "", ...props }: StackProps) {
  const flow = direction === "column" ? "flex-col" : "flex-row flex-wrap";
  return <div className={`flex ${flow} ${gaps[gap]} ${className}`.trim()} {...props} />;
}
