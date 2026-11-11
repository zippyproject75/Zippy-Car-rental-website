export type UserRole = "SUPER_ADMIN" | "CUSTOMER";

export type Permission =
  | "vehicles:read"
  | "vehicles:write"
  | "vehicles:delete"
  | "vehicles:photos"
  | "pricing:write"
  | "availability:write"
  | "coupons:write"
  | "offers:publish"
  | "homepage:write"
  | "locations:write"
  | "policies:write"
  | "enquiries:read"
  | "customers:manage"
  | "audit:read";

const ROLE_PERMISSIONS: Record<UserRole, ReadonlySet<Permission>> = {
  SUPER_ADMIN: new Set([
    "vehicles:read",
    "vehicles:write",
    "vehicles:delete",
    "vehicles:photos",
    "pricing:write",
    "availability:write",
    "coupons:write",
    "offers:publish",
    "homepage:write",
    "locations:write",
    "policies:write",
    "enquiries:read",
    "customers:manage",
    "audit:read",
  ]),
  CUSTOMER: new Set(),
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}
