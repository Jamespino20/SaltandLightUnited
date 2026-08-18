import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { Role } from "@prisma/client";
import { hasPermission, Permission } from "@/lib/permissions";

export interface AuthResult {
  session: Session;
}

export async function requireSession(): Promise<
  AuthResult | NextResponse
> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return { session };
}

export function requireRole(
  session: Session,
  ...roles: Role[]
): NextResponse | null {
  const userRole = session.user.role;
  if (!userRole || !roles.includes(userRole)) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }
  return null;
}

export function requirePermission(
  session: Session,
  permission: Permission
): NextResponse | null {
  if (!hasPermission(session.user.role, permission)) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }
  return null;
}
