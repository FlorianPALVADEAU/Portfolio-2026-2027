import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = { sm: "size-4", md: "size-5", lg: "size-6" } as const;

type IconProps = {
  icon: LucideIcon;
  size?: keyof typeof sizes;
  /** Accessible name. Omit for purely decorative icons, which are hidden from assistive technology. */
  label?: string;
  className?: string;
};

export function Icon({ icon: Glyph, size = "md", label, className }: IconProps) {
  return (
    <Glyph
      className={cn("shrink-0", sizes[size], className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
