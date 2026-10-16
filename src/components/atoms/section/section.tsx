import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Section({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("py-(--section-space)", className)} {...props} />;
}
