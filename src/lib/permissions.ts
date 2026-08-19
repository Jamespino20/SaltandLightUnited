import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
  | "roles:read"
  | "roles:create"
  | "roles:update"
  | "roles:delete"
  | "audit:read"
  | "database:read"
  | "settings:read"
  | "settings:update"
  | "translations:read"
  | "translations:update";

export const ALL_PERMISSIONS: Permission[] = [
  "events:create", "events:read", "events:update", "events:delete",
  "devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete",
  "testimonies:create", "testimonies:read", "testimonies:update", "testimonies:delete", "testimonies:approve",
  "groups:create", "groups:read", "groups:update", "groups:delete",
  "pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete",
  "users:read", "users:create", "users:update", "users:delete",
  "roles:read", "roles:create", "roles:update", "roles:delete",
  "audit:read",
  "database:read",
  "settings:read", "settings:update",
  "translations:read", "translations:update",
];

export const PERMISSION_GROUPS: Record<string, Permission[]> = {
  Events: ["events:create", "events:read", "events:update", "events:delete"],
  Devotionals: ["devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete"],
  Testimonies: ["testimonies:create", "testimonies:read", "testimonies:update", "testimonies:delete", "testimonies:approve"],
  Groups: ["groups:create", "groups:read", "groups:update", "groups:delete"],
  Pubmats: ["pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete"],
  Users: ["users:read", "users:create", "users:update", "users:delete"],
  Roles: ["roles:read", "roles:create", "roles:update", "roles:delete"],
  Audit: ["audit:read"],
  Database: ["database:read"],
  Settings: ["settings:read", "settings:update"],
  Translations: ["translations:read", "translations:update"],
};

const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "events:create", "events:read", "events:update", "events:delete",
    "devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete",
    "testimonies:create", "testimonies:read", "testimonies:update", "testimonies:delete", "testimonies:approve",
    "groups:create", "groups:read", "groups:update", "groups:delete",
    "pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete",
    "users:read", "users:create", "users:update", "users:delete",
    "roles:read", "roles:create", "roles:update", "roles:delete",
    "audit:read",
    "database:read",
    "settings:read", "settings:update",
    "translations:read", "translations:update",
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
    "database:read",
  ],
};

let permissionsCache: Map<Role, Permission[]> | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

async function loadPermissionsFromDB(): Promise<Map<Role, Permission[]>> {
  const now = Date.now();
  if (permissionsCache && now - cacheTime < CACHE_TTL) {
    return permissionsCache;
  }

  const configs = await prisma.roleConfig.findMany();
  const map = new Map<Role, Permission[]>();

  for (const config of configs) {
    const roleName = config.name as Role;
    const perms = config.permissions as string[];
    map.set(roleName, perms.filter((p): p is Permission =>
      ALL_PERMISSIONS.includes(p as Permission)
    ));
  }

  for (const role of Object.keys(DEFAULT_ROLE_PERMISSIONS) as Role[]) {
    if (!map.has(role)) {
      map.set(role, DEFAULT_ROLE_PERMISSIONS[role]);
    }
  }

  permissionsCache = map;
  cacheTime = now;
  return map;
}

export async function hasPermissionDB(role: Role, permission: Permission): Promise<boolean> {
  const perms = await loadPermissionsFromDB();
  return perms.get(role)?.includes(permission) ?? false;
}

export async function getPermissionsDB(role: Role): Promise<Permission[]> {
  const perms = await loadPermissionsFromDB();
  return perms.get(role) ?? [];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return DEFAULT_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
  return DEFAULT_ROLE_PERMISSIONS[role] ?? [];
}

export function invalidatePermissionsCache() {
  permissionsCache = null;
  cacheTime = 0;
}
