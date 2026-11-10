import Link from "next/link";

/** Fallback for requests outside the locale routing (rare: the proxy localizes all pages). */
export default function RootNotFound() {
  return (
    <html lang="en-IN">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "4rem 1.5rem",
          background: "#0a0a0b",
          color: "#f3eee4",
        }}
      >
        <h1>We couldn’t find that page</h1>
        <p>
          <Link href="/" style={{ color: "#d4b373" }}>
            Go to Zippy Car Rental
          </Link>
        </p>
      </body>
    </html>
  );
}
