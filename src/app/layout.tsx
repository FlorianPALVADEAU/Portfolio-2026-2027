import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Document } from "@/components/templates/document";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Florian Palvadeau",
  description: "Full-stack software engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <Document lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </Document>
  );
}
