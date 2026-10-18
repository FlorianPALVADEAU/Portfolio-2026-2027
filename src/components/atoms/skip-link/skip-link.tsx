import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Hidden until focused; lets keyboard users bypass the header. */
export function SkipLink({ className, ...props }: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-(--z-toast) focus-visible:rounded-md focus-visible:bg-accent focus-visible:px-4 focus-visible:py-3 focus-visible:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}
