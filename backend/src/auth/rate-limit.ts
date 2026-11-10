import { getDatabase } from "./database.js";
import { hashRateLimitKey } from "./security.js";

export async function consumeRateLimit(
  scope: string,
  identity: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const keyHash = hashRateLimitKey(scope, identity);
  const [row] = await getDatabase()`
    INSERT INTO auth_rate_limits (key_hash, attempts, reset_at)
    VALUES (${keyHash}, 1, now() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT (key_hash) DO UPDATE SET
      attempts = CASE WHEN auth_rate_limits.reset_at <= now() THEN 1 ELSE auth_rate_limits.attempts + 1 END,
      reset_at = CASE
        WHEN auth_rate_limits.reset_at <= now()
        THEN now() + make_interval(secs => ${windowSeconds})
        ELSE auth_rate_limits.reset_at
      END
    RETURNING attempts, GREATEST(1, CEIL(EXTRACT(EPOCH FROM (reset_at - now()))))::integer AS retry_after
  `;
  if (!row) {
    throw new Error("Rate-limit counter could not be recorded.");
  }

  return {
    allowed: row.attempts <= limit,
    retryAfterSeconds: row.retry_after,
  };
}
