import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const testimony = await prisma.testimony.findUnique({ where: { id } });
    if (!testimony) {
      return NextResponse.json(
        { success: false, error: "Testimony not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: testimony });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimony" },
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

  const { id } = await params;
  try {
    const body = await request.json();
    const { authorName, authorAge, content, imageUrl, approved } = body;

    const testimony = await prisma.testimony.update({
      where: { id },
      data: {
        ...(authorName !== undefined && { authorName }),
        ...(authorAge !== undefined && { authorAge }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(approved !== undefined && { approved }),
      },
    });

    return NextResponse.json({ success: true, data: testimony });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update testimony" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  try {
    await prisma.testimony.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete testimony" },
      { status: 500 }
    );
  }
}
