import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every page route; skip Next internals, metadata routes and files with extensions.
  matcher: ["/((?!_next|_vercel|api|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)"],
};
