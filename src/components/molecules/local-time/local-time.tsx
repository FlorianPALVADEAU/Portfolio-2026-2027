"use client";

import { useEffect, useState } from "react";

type LocalTimeProps = {
  locale: string;
  /** IANA zone whose clock is shown. */
  timeZone: string;
};

const REFRESH = 15_000;

/**
 * The time where the owner lives. The clock is read in the browser only, so the server markup
 * and the first client render agree on a placeholder.
 */
export function LocalTime({ locale, timeZone }: LocalTimeProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, REFRESH);
    return () => window.clearInterval(timer);
  }, []);

  const clock = now
    ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone }).format(now)
    : "--:--";

  return <span className="tabular-nums">{clock}</span>;
}
