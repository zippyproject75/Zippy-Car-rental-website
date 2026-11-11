import type { ISql } from "postgres";
import { getDatabase } from "./database.js";

type AuditValue = string | number | boolean | null | AuditValue[] | { [key: string]: AuditValue };

export type AuditEventInput = {
  actorUserId: string | null;
  action: string;
  subjectType?: string | null;
  subjectId?: string | null;
  summary?: Record<string, AuditValue>;
  requestMetadata?: { clientAddress?: string; userAgent?: string | null };
};

export async function recordAdminActivity(
  event: AuditEventInput,
  database: ISql = getDatabase(),
): Promise<void> {
  const requestMetadata = {
    clientAddress: event.requestMetadata?.clientAddress ?? null,
    userAgent: event.requestMetadata?.userAgent?.slice(0, 500) ?? null,
  };

  await database`
    INSERT INTO admin_activity_logs
      (actor_user_id, action, subject_type, subject_id, summary, request_metadata)
    VALUES (
      ${event.actorUserId},
      ${event.action},
      ${event.subjectType ?? null},
      ${event.subjectId ?? null},
      ${JSON.stringify(event.summary ?? {})}::jsonb,
      ${JSON.stringify(requestMetadata)}::jsonb
    )
  `;
}

export async function getRecentAdminActivity(limit = 50) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  return getDatabase()`
    SELECT l.id, l.action, l.subject_type AS "subjectType",
      l.subject_id AS "subjectId", l.summary, l.request_metadata AS "requestMetadata",
      l.created_at AS "createdAt", u.email AS "actorEmail"
    FROM admin_activity_logs l
    LEFT JOIN auth.users u ON u.id = l.actor_user_id
    ORDER BY l.created_at DESC
    LIMIT ${safeLimit}
  `;
}
