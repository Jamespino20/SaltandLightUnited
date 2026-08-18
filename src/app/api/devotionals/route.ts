import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  try {
    const devotionals = await prisma.devotional.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: devotionals });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch devotionals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { title, content, author, scriptureRef, imageUrl, publishedAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const devotional = await prisma.devotional.create({
      data: {
        title,
        content,
        author,
        scriptureRef,
        imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: devotional }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create devotional" },
      { status: 500 }
    );
  }
}
