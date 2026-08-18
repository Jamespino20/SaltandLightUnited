import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ success: true, data: events });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "events:create");
  if (permError) return permError;

  try {
    const body = await request.json();
    const { title, description, date, location, imageUrl, featured } = body;

    if (!title || !date) {
      return NextResponse.json(
        { success: false, error: "Title and date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: { title, description, date: new Date(date), location, imageUrl, featured },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.CREATE,
      targetTable: "event",
      targetId: event.id,
    }, request);

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}
