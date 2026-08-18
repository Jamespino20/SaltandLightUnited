import { Role } from "@prisma/client";

export type Permission =
  | "events:create"
  | "events:read"
  | "events:update"
  | "events:delete"
  | "devotionals:create"
  | "devotionals:read"
  | "devotionals:update"
  | "devotionals:delete"
  | "testimonies:create"
  | "testimonies:read"
  | "testimonies:update"
  | "testimonies:delete"
  | "testimonies:approve"
  | "groups:create"
  | "groups:read"
  | "groups:update"
  | "groups:delete"
  | "pubmats:create"
  | "pubmats:read"
  | "pubmats:update"
  | "pubmats:delete"
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "audit:read"
  | "settings:read"
  | "settings:update";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "events:create", "events:read", "events:update", "events:delete",
    "devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete",
    "testimonies:create", "testimonies:read", "testimonies:update", "testimonies:delete", "testimonies:approve",
    "groups:create", "groups:read", "groups:update", "groups:delete",
    "pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete",
    "users:read", "users:create", "users:update", "users:delete",
    "audit:read",
    "settings:read", "settings:update",
  ],
  editor: [
    "events:create", "events:read", "events:update", "events:delete",
    "devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete",
    "testimonies:read", "testimonies:update", "testimonies:approve",
    "groups:create", "groups:read", "groups:update", "groups:delete",
    "pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete",
    "users:read",
    "audit:read",
  ],
  viewer: [
    "events:read",
    "devotionals:read",
    "testimonies:read",
    "groups:read",
    "pubmats:read",
    "users:read",
    "audit:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
