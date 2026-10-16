import type { ReactNode } from "react";

type DocumentProps = {
  lang: string;
  className?: string;
  children: ReactNode;
};

export function Document({ lang, className = "", children }: DocumentProps) {
  return (
    <html lang={lang} className={`h-full antialiased ${className}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
