import NextLink from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  /** Opens in a new tab with safe `rel` values. */
  external?: boolean;
};

export function Link({ external = false, className, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        "underline decoration-1 underline-offset-4 transition-colors duration-(--duration-fast) hover:text-accent",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
