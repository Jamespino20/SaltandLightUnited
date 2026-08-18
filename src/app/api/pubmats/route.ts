import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  try {
    const pubmats = await prisma.pubmat.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: pubmats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch pubmats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { title, description, imageUrl, category, eventId } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and image URL are required" },
        { status: 400 }
      );
    }

    const pubmat = await prisma.pubmat.create({
      data: { title, description, imageUrl, category, eventId },
    });

    return NextResponse.json({ success: true, data: pubmat }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create pubmat" },
      { status: 500 }
    );
  }
}
