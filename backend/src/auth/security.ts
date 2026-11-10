import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isTrustedFrontendOrigin(
  origin: string | undefined,
  fetchSite: string | undefined,
  forwardedProtocol: string | undefined,
): boolean {
  const allowedOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
  if (!origin || !forwardedProtocol) return false;
  try {
    if (new URL(origin).origin !== new URL(allowedOrigin).origin) return false;
    if (
      process.env.NODE_ENV === "production" &&
      forwardedProtocol.split(",")[0]?.trim() !== "https"
    ) {
      return false;
    }
    return fetchSite !== "cross-site";
  } catch {
    return false;
  }
}

export function normalizeClientAddress(address: string | undefined): string {
  return address && isIP(address) ? address : "unknown";
}

export function hashRateLimitKey(scope: string, value: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 bytes.");
  }
  return createHmac("sha256", secret).update(`${scope}:${value}`).digest("hex");
}
