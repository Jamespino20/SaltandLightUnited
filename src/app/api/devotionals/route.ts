import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET() {
  try {
    const devotionals = await prisma.devotional.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: devotionals });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch devotionals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "devotionals:create");
  if (permError) return permError;

  try {
    const body = await request.json();
    const { title, description, content, author, scriptureRef, imageUrl, publishedAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const devotional = await prisma.devotional.create({
      data: {
        title,
        description: description || null,
        content,
        author,
        scriptureRef,
        imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.CREATE,
      targetTable: "devotional",
      targetId: devotional.id,
    }, request);

    return NextResponse.json({ success: true, data: devotional }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create devotional" },
      { status: 500 }
    );
  }
}
