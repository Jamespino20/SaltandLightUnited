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
    const pubmat = await prisma.pubmat.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!pubmat) {
      return NextResponse.json(
        { success: false, error: "Pubmat not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: pubmat });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch pubmat" },
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
    const { title, description, imageUrl, category, eventId } = body;

    const pubmat = await prisma.pubmat.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(eventId !== undefined && { eventId }),
      },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "pubmat",
      targetId: id,
    }, request);

    return NextResponse.json({ success: true, data: pubmat });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update pubmat" },
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
    await prisma.pubmat.delete({ where: { id } });
    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.DELETE,
      targetTable: "pubmat",
      targetId: id,
    }, request);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete pubmat" },
      { status: 500 }
    );
  }
}
