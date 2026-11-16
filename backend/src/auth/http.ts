import { consumeRateLimit } from "./rate-limit.js";
import { normalizeEmail } from "./security.js";

export async function enforceRateLimits(
  scope: string,
  email: string,
  clientAddress: string,
  policies: { scope: string; limit: number; windowSeconds: number }[],
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const normalizedEmail = normalizeEmail(email);
  const allPolicies = [
    { scope: `${scope}-ip`, identity: clientAddress, limit: 30, windowSeconds: 900 },
    ...policies.map((policy) => ({
      ...policy,
      identity: normalizedEmail,
    })),
  ];

  for (const policy of allPolicies) {
    const result = await consumeRateLimit(
      policy.scope,
      policy.identity,
      policy.limit,
      policy.windowSeconds,
    );
    if (!result.allowed) {
      return { allowed: false, retryAfterSeconds: result.retryAfterSeconds };
    }
  }
  return { allowed: true };
}
