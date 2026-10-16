import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function Container({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-(--container-max) px-(--gutter)", className)}
      {...props}
    />
  );
}
