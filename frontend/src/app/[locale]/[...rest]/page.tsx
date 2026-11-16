import { notFound } from "next/navigation";

/** Any unmatched localized path renders the localized not-found page with a 404 status. */
export default function CatchAll() {
  notFound();
}
