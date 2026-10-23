/** An unset variable and one left blank in `.env` both mean "not configured". */
export function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Settings shown to visitors. Each key is spelled out in full: Next inlines `NEXT_PUBLIC_*`
 * variables into the client bundle only when they are read that way.
 */
export const publicEnv = {
  contactEmail: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  contactPhone: optional(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  turnstileSiteKey: optional(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
} as const;
