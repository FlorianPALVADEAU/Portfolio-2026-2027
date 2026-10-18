import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const LOGO_URL = "url(/brand/fpl-logo.png)";

/** The source is a black raster, so it is used as a mask and takes the current text color in every theme. */
const maskStyle: CSSProperties = {
  maskImage: LOGO_URL,
  WebkitMaskImage: LOGO_URL,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "left center",
  WebkitMaskPosition: "left center",
};

type LogoProps = {
  /** Accessible name. Omit when the logo sits next to the same text, so it stays decorative. */
  label?: string;
  className?: string;
};

export function Logo({ label, className }: LogoProps) {
  return (
    <span
      className={cn("inline-block aspect-[539/150] h-5 bg-current", className)}
      style={maskStyle}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    />
  );
}
