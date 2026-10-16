import type { ComponentPropsWithoutRef } from "react";

export function Section({ className = "", ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={`py-(--section-space) ${className}`.trim()} {...props} />;
}
