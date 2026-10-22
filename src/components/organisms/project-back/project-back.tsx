import { ArrowLeft } from "lucide-react";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import type { Locale } from "@/lib/i18n";

/**
 * The way back to the list, fixed to the corner of the screen so it is within reach wherever the
 * story has got to. The marked attributes bring the visitor to the card they came from.
 */
export function ProjectBack({ locale, label }: { locale: Locale; label: string }) {
  return (
    <Link
      href={`/${locale}#works`}
      data-restore-scroll=""
      data-no-cover=""
      className="pill-in fixed bottom-5 left-5 z-40 hidden min-h-11 lg:inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 text-sm no-underline backdrop-blur-md transition-colors hover:border-accent hover:text-foreground focus-visible:outline-offset-4 lg:bottom-6 lg:left-6"
    >
      <Icon icon={ArrowLeft} size="sm" />
      {label}
    </Link>
  );
}
