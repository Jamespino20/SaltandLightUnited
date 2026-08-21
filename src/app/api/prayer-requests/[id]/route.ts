import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;

  try {
    const updated = await prisma.prayerRequest.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Prayer request not found" },
      { status: 404 }
    );
  }
}
