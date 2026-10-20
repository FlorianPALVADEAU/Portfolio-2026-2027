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
        {/* Plain server-rendered script: next/script replays inline scripts on the client, which React 19 warns about. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static constant, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
