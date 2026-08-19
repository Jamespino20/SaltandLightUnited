import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET() {
  try {
    const guides = await prisma.fellowshipGuide.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: guides });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fellowship guides" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "pubmats:create");
  if (permError) return permError;

  try {
    const body = await request.json();
    const { title, description, fileUrl, thumbnailUrl, category } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { success: false, error: "Title and file are required" },
        { status: 400 }
      );
    }

    const guide = await prisma.fellowshipGuide.create({
      data: { title, description, fileUrl, thumbnailUrl, category },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.CREATE,
      targetTable: "fellowshipGuide",
      targetId: guide.id,
    }, request);

    return NextResponse.json({ success: true, data: guide }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create fellowship guide" },
      { status: 500 }
    );
  }
}
