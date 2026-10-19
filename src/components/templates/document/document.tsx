import Script from "next/script";
import type { ReactNode } from "react";
import { themeInitScript } from "@/lib/theme";
import { cn } from "@/lib/utils";

type DocumentProps = {
  lang: string;
  className?: string;
  children: ReactNode;
};

export function Document({ lang, className = "", children }: DocumentProps) {
  return (
    <html lang={lang} suppressHydrationWarning className={cn("h-full antialiased", className)}>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
