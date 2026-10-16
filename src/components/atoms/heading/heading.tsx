import type { ComponentPropsWithoutRef } from "react";

const sizes = {
  display: "text-display font-semibold tracking-tight",
  "3xl": "text-3xl font-semibold tracking-tight",
  "2xl": "text-2xl font-semibold tracking-tight",
  xl: "text-xl font-semibold",
  lg: "text-lg font-semibold",
} as const;

type HeadingProps = ComponentPropsWithoutRef<"h1"> & {
  /** Semantic level, independent from the visual size. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: keyof typeof sizes;
};

export function Heading({ level, size = "2xl", className = "", ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={`text-balance ${sizes[size]} ${className}`.trim()} {...props} />;
}
