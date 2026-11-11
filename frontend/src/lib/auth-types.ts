export type UserRole = "SUPER_ADMIN" | "CUSTOMER";

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  role: UserRole;
};

export type AdminActivityEntry = {
  id: string;
  action: string;
  subjectType: string | null;
  subjectId: string | null;
  summary: Record<string, unknown>;
  requestMetadata: Record<string, unknown>;
  createdAt: string | Date;
  actorEmail: string | null;
};
