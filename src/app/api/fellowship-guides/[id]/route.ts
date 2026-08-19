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
    const guide = await prisma.fellowshipGuide.findUnique({ where: { id } });
    if (!guide) {
      return NextResponse.json(
        { success: false, error: "Fellowship guide not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: guide });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fellowship guide" },
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

  const permError = await requirePermission(authResult.session, "pubmats:update");
  if (permError) return permError;

  const { id } = await params;
  try {
    const body = await request.json();
    const { title, description, fileUrl, thumbnailUrl, category } = body;

    const guide = await prisma.fellowshipGuide.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(category !== undefined && { category }),
      },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "fellowshipGuide",
      targetId: id,
    }, request);

    return NextResponse.json({ success: true, data: guide });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update fellowship guide" },
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

  const permError = await requirePermission(authResult.session, "pubmats:delete");
  if (permError) return permError;

  const { id } = await params;
  try {
    await prisma.fellowshipGuide.delete({ where: { id } });
    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.DELETE,
      targetTable: "fellowshipGuide",
      targetId: id,
    }, request);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete fellowship guide" },
      { status: 500 }
    );
  }
}
