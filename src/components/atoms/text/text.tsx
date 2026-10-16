import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

const sizes = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" } as const;
const tones = { default: "text-foreground", muted: "text-muted-foreground" } as const;

type TextProps = ComponentPropsWithoutRef<"p"> & {
  as?: Extract<ElementType, "p" | "span" | "small" | "strong" | "em">;
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
};

export function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  className = "",
  ...props
}: TextProps) {
  return <Tag className={cn(sizes[size], tones[tone], className)} {...props} />;
}
