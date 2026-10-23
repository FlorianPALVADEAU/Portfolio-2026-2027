import { type NextRequest, NextResponse } from "next/server";
import { isLocale, negotiateLocale } from "@/lib/i18n";
import { isKnownPath, NOT_FOUND_SEGMENT } from "@/lib/routes";
import { registry } from "../content/registry";

const projectSlugs = Object.keys(registry.project);
/** Marks the proxy's own request for the 404 page, which must be served as is. */
const STATUS_PAGE_HEADER = "x-status-page";

/**
 * The 404 page is an ordinary static route, so the router would answer it with 200, and a rewrite
 * cannot change the status. The proxy fetches the page and sends it back as a 404 instead; if that
 * fails, the visitor still gets the page, with the wrong status rather than none.
 */
async function notFoundResponse(request: NextRequest, locale: string) {
  const url = new URL(`/${locale}/${NOT_FOUND_SEGMENT}`, request.nextUrl.origin);
  try {
    const page = await fetch(url, { headers: { [STATUS_PAGE_HEADER]: "1" } });
    if (page.ok) {
      return new NextResponse(page.body, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  } catch {
    // Fall through to the plain rewrite.
  }
  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (isLocale(first)) {
    if (request.headers.has(STATUS_PAGE_HEADER) || isKnownPath(pathname, projectSlugs)) {
      return NextResponse.next();
    }
    return notFoundResponse(request, first);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${negotiateLocale(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
