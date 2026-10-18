import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Cookie-free, first-party measurement, so no consent banner is needed. */
export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
