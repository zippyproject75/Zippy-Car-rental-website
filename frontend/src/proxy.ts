import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip auth callback exchange and API routes, which must retain their exact paths.
  matcher: [
    "/((?!_next|_vercel|api|auth/callback|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)",
  ],
};
