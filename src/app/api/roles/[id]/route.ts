import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";
import { ALL_PERMISSIONS, Permission, invalidatePermissionsCache } from "@/lib/permissions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const role = await prisma.roleConfig.findUnique({ where: { id } });
    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: role });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "roles:update");
  if (permError) return permError;

  const { id } = await params;

  try {
    const existing = await prisma.roleConfig.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    if (existing.isSystem) {
      const body = await request.clone().json();
      const { name: requestedName } = body;
      if (requestedName && requestedName !== existing.name) {
        return NextResponse.json(
          { success: false, error: "Cannot change the identifier of a system role" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { displayName, permissions, isDefault } = body;

    const validPermissions = (permissions as string[] || []).filter(
      (p): p is Permission => ALL_PERMISSIONS.includes(p as Permission)
    );

    if (isDefault) {
      await prisma.roleConfig.updateMany({ data: { isDefault: false } });
    }

    const role = await prisma.roleConfig.update({
      where: { id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(permissions !== undefined && { permissions: validPermissions }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    invalidatePermissionsCache();

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "role_config",
      targetId: id,
      metadata: { roleName: role.name, permissionCount: validPermissions.length },
    }, request);

    return NextResponse.json({ success: true, data: role });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update role" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "roles:delete");
  if (permError) return permError;

  const { id } = await params;

  try {
    const existing = await prisma.roleConfig.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      );
    }

    if (existing.isSystem) {
      return NextResponse.json(
        { success: false, error: "Cannot delete system roles" },
        { status: 403 }
      );
    }

    const userCount = await prisma.user.count({
      where: { role: existing.name as "admin" | "editor" | "viewer" },
    });

    if (userCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete role: ${userCount} user(s) still assigned to it` },
        { status: 409 }
      );
    }

    await prisma.roleConfig.delete({ where: { id } });
    invalidatePermissionsCache();

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.DELETE,
      targetTable: "role_config",
      targetId: id,
      metadata: { roleName: existing.name },
    }, request);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
