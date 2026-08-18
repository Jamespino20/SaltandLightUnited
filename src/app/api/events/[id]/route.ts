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
    const event = await prisma.event.findUnique({
      where: { id },
      include: { pubmats: true },
    });
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: event });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
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

  const permError = await requirePermission(authResult.session, "events:update");
  if (permError) return permError;

  const { id } = await params;
  try {
    const body = await request.json();
    const { title, description, date, location, imageUrl, featured } = body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(location !== undefined && { location }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(featured !== undefined && { featured }),
      },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "event",
      targetId: id,
    }, request);

    return NextResponse.json({ success: true, data: event });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
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

  const permError = await requirePermission(authResult.session, "events:delete");
  if (permError) return permError;

  const { id } = await params;
  try {
    await prisma.event.delete({ where: { id } });
    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.DELETE,
      targetTable: "event",
      targetId: id,
    }, request);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
