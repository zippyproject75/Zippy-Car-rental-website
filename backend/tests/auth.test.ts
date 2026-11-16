import { afterEach, describe, expect, it, vi } from "vitest";
import { hasPermission } from "../src/auth/permissions.js";
import {
  hashRateLimitKey,
  isTrustedFrontendOrigin,
} from "../src/auth/security.js";
import { createServer } from "../src/server.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Supabase authentication and API security", () => {
  it("rejects malformed registration data without contacting Supabase", async () => {
    const server = createServer();
    try {
      const response = await server.inject({
        method: "POST",
        url: "/api/auth/register",
        headers: {
          origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
          "sec-fetch-site": "same-origin",
        },
        payload: {
          email: "not-an-email",
          password: "short",
          displayName: "",
          isAdmin: true,
        },
      });

      expect(response.statusCode).toBe(400);
    } finally {
      await server.close();
    }
  });

  it("requires a customer session to submit a rental enquiry", async () => {
    const server = createServer();
    try {
      const response = await server.inject({
        method: "POST",
        url: "/api/enquiries",
        headers: {
          origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
          "sec-fetch-site": "same-origin",
        },
        payload: {
          vehicleSlug: "fronx",
          packageCode: "12-hour",
          pickupLocationSlug: "khadi-machine-chowk",
          pickupAt: "2026-12-01T04:30:00.000Z",
          returnAt: "2026-12-01T16:30:00.000Z",
        },
      });

      expect(response.statusCode).toBe(401);
    } finally {
      await server.close();
    }
  });

  it("requires the configured frontend origin for mutations", () => {
    vi.stubEnv("FRONTEND_ORIGIN", "https://zippy.example");
    expect(isTrustedFrontendOrigin("https://zippy.example", "same-origin", "https")).toBe(true);
    expect(isTrustedFrontendOrigin("https://attacker.example", "cross-site", "https")).toBe(false);
    expect(isTrustedFrontendOrigin(undefined, undefined, "https")).toBe(false);
  });

  it("requires HTTPS for production mutations", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("FRONTEND_ORIGIN", "https://zippy.example");
    expect(isTrustedFrontendOrigin("https://zippy.example", "same-origin", "http")).toBe(false);
    expect(isTrustedFrontendOrigin("https://zippy.example", "same-origin", "https")).toBe(true);
  });

  it("requires the server secret to derive rate-limit identifiers", () => {
    vi.stubEnv("AUTH_SECRET", "x".repeat(32));
    const first = hashRateLimitKey("login", "user@example.test");
    expect(hashRateLimitKey("login", "user@example.test")).toBe(first);
    expect(hashRateLimitKey("register", "user@example.test")).not.toBe(first);

    vi.stubEnv("AUTH_SECRET", "short");
    expect(() => hashRateLimitKey("login", "user@example.test")).toThrow(
      "AUTH_SECRET must contain at least 32 bytes.",
    );
  });

});

describe("role permissions", () => {
  it("grants owner permissions only to the single super-admin role", () => {
    expect(hasPermission("SUPER_ADMIN", "vehicles:write")).toBe(true);
    expect(hasPermission("SUPER_ADMIN", "audit:read")).toBe(true);
    expect(hasPermission("CUSTOMER", "vehicles:write")).toBe(false);
    expect(hasPermission("CUSTOMER", "customers:manage")).toBe(false);
  });

});
