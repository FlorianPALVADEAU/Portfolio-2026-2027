const DEFAULT_SITE_URL = "https://palvadeau.ch";

/** Canonical origin without a trailing slash; override with SITE_URL per environment. */
export const siteUrl = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

export const siteName = "Florian Palvadeau";
