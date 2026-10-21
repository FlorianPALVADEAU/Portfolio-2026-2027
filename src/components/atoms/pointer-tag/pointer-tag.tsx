import type { LucideIcon } from "lucide-react";
import type { ReactNode, Ref } from "react";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/utils";

/**
 * Where the tag sits: `pointer` hangs off the top left corner of its box, so a script can move it
 * beside the mouse; `bottom` is centred along the bottom edge of the screen, for touch.
 */
const anchors = {
  pointer: "top-0 left-0 mt-4 ml-4 origin-top-left",
  bottom: "left-1/2 -translate-x-1/2",
} as const;

type PointerTagProps = {
  icon: LucideIcon;
  anchor: keyof typeof anchors;
  className?: string;
  iconClassName?: string;
  ref?: Ref<HTMLDivElement>;
  children: ReactNode;
};

/**
 * The small label that tells a visitor what the page offers: "scroll", "view". Every one of them
 * looks the same, so the cue is always read the same way. Decoration only: it is hidden from
 * assistive technology, never takes a click, and starts hidden until a script reveals it.
 */
export function PointerTag({
  icon,
  anchor,
  className,
  iconClassName,
  ref,
  children,
}: PointerTagProps) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none invisible fixed z-(--z-overlay) flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 font-mono text-[0.6875rem] tracking-widest whitespace-nowrap text-accent-foreground uppercase shadow-md",
        anchors[anchor],
        className,
      )}
    >
      {children}
      <Icon icon={icon} size="sm" className={cn("size-3", iconClassName)} />
    </div>
  );
}
