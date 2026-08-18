import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

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

    return NextResponse.json({ success: true, data: pubmat });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update pubmat" },
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
    await prisma.pubmat.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete pubmat" },
      { status: 500 }
    );
  }
}
