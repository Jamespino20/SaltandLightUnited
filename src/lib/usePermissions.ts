"use client";

import { useSession } from "next-auth/react";

export function usePermissions() {
  const { data: session } = useSession();
  const permissions = (session?.user?.permissions as string[]) ?? [];
  const role = session?.user?.role;

  const has = (perm: string) =>
    role === "admin" || permissions.includes(perm);

  return {
    permissions,
    role,
    has,
    can: has,
    canCreate: (resource: string) => has(`${resource}:create`),
    canRead: (resource: string) => has(`${resource}:read`),
    canUpdate: (resource: string) => has(`${resource}:update`),
    canDelete: (resource: string) => has(`${resource}:delete`),
  };
}
