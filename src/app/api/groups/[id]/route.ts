import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: group });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch group" },
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

  const permError = await requirePermission(authResult.session, "groups:update");
  if (permError) return permError;

  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, meetingSchedule, leader, imageUrl } = body;

    const group = await prisma.group.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(meetingSchedule !== undefined && { meetingSchedule }),
        ...(leader !== undefined && { leader }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "group",
      targetId: id,
    }, request);

    return NextResponse.json({ success: true, data: group });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update group" },
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

  const permError = await requirePermission(authResult.session, "groups:delete");
  if (permError) return permError;

  const { id } = await params;
  try {
    await prisma.group.delete({ where: { id } });
    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.DELETE,
      targetTable: "group",
      targetId: id,
    }, request);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
