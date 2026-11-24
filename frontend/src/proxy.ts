import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function hasAuthCallbackParams(request: NextRequest): boolean {
  const params = request.nextUrl.searchParams;
  if (params.has("code")) return true;
  if (params.has("token_hash") && params.has("type")) return true;
  return (
    params.has("error") ||
    params.has("error_code") ||
    params.has("error_description")
  );
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname !== "/auth/callback" && hasAuthCallbackParams(request)) {
    const callbackUrl = new URL(`/auth/callback${search}`, request.url);
    return NextResponse.redirect(callbackUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  // Run on app pages (and root) but skip auth callback exchange, API routes, and static assets.
  matcher: [
    "/((?!_next|_vercel|api|auth/callback|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)",
  ],
};
