import { isLocale } from "@/lib/i18n";

/** Page the proxy answers an unknown address with; it is a real route, so it keeps header and footer. */
export const NOT_FOUND_SEGMENT = "404";

/**
 * Whether an address leads to something the site serves. The proxy asks before the router does
 * because Cache Components sends the status line with the static shell: a `notFound()` thrown
 * while rendering would answer 200 or fall back to a page outside the layout. Add a route here
 * when it is added to `src/app`, or visitors will get the 404 page instead of it.
 */
export function isKnownPath(pathname: string, projectSlugs: readonly string[]): boolean {
  const [locale = "", section, slug, ...rest] = pathname.split("/").filter(Boolean);
  if (!isLocale(locale)) return false;
  if (section === undefined) return true;
  if (section === "opengraph-image") return slug === undefined;
  return (
    section === "projects" && slug !== undefined && rest.length === 0 && projectSlugs.includes(slug)
  );
}
