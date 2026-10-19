import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const artwork: Record<Locale, ReactNode> = {
  fr: (
    <>
      <rect width="1" height="2" fill="#0055a4" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ef4135" />
    </>
  ),
  de: (
    <>
      <rect width="3" height="0.67" fill="#000" />
      <rect y="0.67" width="3" height="0.67" fill="#dd0000" />
      <rect y="1.34" width="3" height="0.66" fill="#ffce00" />
    </>
  ),
  en: (
    <>
      <rect width="3" height="2" fill="#012169" />
      <path d="M0 0 3 2M3 0 0 2" stroke="#fff" strokeWidth="0.4" />
      <path d="M0 0 3 2M3 0 0 2" stroke="#c8102e" strokeWidth="0.15" />
      <path d="M1.5 0v2M0 1h3" stroke="#fff" strokeWidth="0.7" />
      <path d="M1.5 0v2M0 1h3" stroke="#c8102e" strokeWidth="0.42" />
    </>
  ),
};

type FlagProps = {
  locale: Locale;
  className?: string;
};

/** Decorative: the surrounding control carries the accessible name. */
export function Flag({ locale, className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 3 2"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("size-6 rounded-full", className)}
    >
      {artwork[locale]}
    </svg>
  );
}
