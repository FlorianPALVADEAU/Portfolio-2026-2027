"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MAIN_ID } from "./main-id";

/** Moves focus to the main landmark after client navigation so keyboard and screen reader users start at the new content. */
export function RouteFocus() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
