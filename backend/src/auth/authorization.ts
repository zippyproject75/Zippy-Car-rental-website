import { hasPermission, type Permission, type UserRole } from "./permissions.js";
import type { AuthenticatedUser } from "./session.js";

export function isAllowedRole(user: AuthenticatedUser, roles: readonly UserRole[]): boolean {
  return roles.includes(user.role);
}

export function isAllowedPermission(user: AuthenticatedUser, permission: Permission): boolean {
  return hasPermission(user.role, permission);
}
