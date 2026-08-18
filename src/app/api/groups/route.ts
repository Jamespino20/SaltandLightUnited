import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: groups });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "groups:create");
  if (permError) return permError;

  try {
    const body = await request.json();
    const { name, description, meetingSchedule, leader, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: { name, description, meetingSchedule, leader, imageUrl },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.CREATE,
      targetTable: "group",
      targetId: group.id,
    }, request);

    return NextResponse.json({ success: true, data: group }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create group" },
      { status: 500 }
    );
  }
}
