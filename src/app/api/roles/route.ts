import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { ALL_PERMISSIONS, Permission, invalidatePermissionsCache } from "@/lib/permissions";

export async function GET() {
  try {
    const roles = await prisma.roleConfig.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: roles });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "roles:create");
  if (permError) return permError;

  try {
    const body = await request.json();
    const { name, displayName, permissions, isDefault } = body;

    if (!name || !displayName) {
      return NextResponse.json(
        { success: false, error: "Name and display name are required" },
        { status: 400 }
      );
    }

    const validName = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const existing = await prisma.roleConfig.findUnique({ where: { name: validName } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A role with this name already exists" },
        { status: 409 }
      );
    }

    const validPermissions = (permissions as string[] || []).filter(
      (p): p is Permission => ALL_PERMISSIONS.includes(p as Permission)
    );

    const role = await prisma.roleConfig.create({
      data: {
        name: validName,
        displayName,
        permissions: validPermissions,
        isDefault: isDefault ?? false,
        isSystem: false,
      },
    });

    invalidatePermissionsCache();

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.CREATE,
      targetTable: "role_config",
      targetId: role.id,
      metadata: { roleName: validName, permissionCount: validPermissions.length },
    }, request);

    return NextResponse.json({ success: true, data: role }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create role" },
      { status: 500 }
    );
  }
}
