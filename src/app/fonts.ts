import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Classes that expose both font variables; shared by the site layout and the global 404. */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;
