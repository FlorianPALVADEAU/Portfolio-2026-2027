type ClickLike = Pick<
  MouseEvent,
  "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "defaultPrevented"
>;
type AnchorLike = Pick<HTMLAnchorElement, "href" | "target" | "hasAttribute">;

/**
 * Returns the `path?query#hash` to navigate to when a click is a plain same-origin page
 * navigation, or null when the browser should handle it (new tab, download, hash jump, external).
 */
export function getInternalNavigation(
  event: ClickLike,
  anchor: AnchorLike,
  current: Pick<URL, "origin" | "pathname" | "search">,
): string | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return null;

  const url = new URL(anchor.href);
  if (url.origin !== current.origin) return null;
  if (url.pathname === current.pathname && url.search === current.search) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}
