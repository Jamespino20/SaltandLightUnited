import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const testimonies = await prisma.testimony.findMany({
      where: all ? {} : { approved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: testimonies });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorName, authorAge, description, content, imageUrl, contactEmail, contactPhone } = body;

    if (!authorName || !content) {
      return NextResponse.json(
        { success: false, error: "Author name and content are required" },
        { status: 400 }
      );
    }

    const testimony = await prisma.testimony.create({
      data: {
        authorName,
        authorAge,
        description: description || null,
        content,
        imageUrl: imageUrl || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
      },
    });

    return NextResponse.json({ success: true, data: testimony }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create testimony" },
      { status: 500 }
    );
  }
}
