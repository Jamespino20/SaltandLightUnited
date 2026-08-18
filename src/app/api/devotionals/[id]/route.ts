import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const devotional = await prisma.devotional.findUnique({ where: { id } });
    if (!devotional) {
      return NextResponse.json(
        { success: false, error: "Devotional not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: devotional });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch devotional" },
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
    const { title, content, author, scriptureRef, imageUrl, publishedAt } = body;

    const devotional = await prisma.devotional.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(author !== undefined && { author }),
        ...(scriptureRef !== undefined && { scriptureRef }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
      },
    });

    return NextResponse.json({ success: true, data: devotional });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update devotional" },
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
    await prisma.devotional.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete devotional" },
      { status: 500 }
    );
  }
}
