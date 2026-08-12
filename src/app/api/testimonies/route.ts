import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const testimonies = await db.testimony.findMany({
      where: { approved: true },
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
    const { authorName, authorAge, content, imageUrl } = body;

    if (!authorName || !content) {
      return NextResponse.json(
        { success: false, error: "Author name and content are required" },
        { status: 400 }
      );
    }

    const testimony = await db.testimony.create({
      data: { authorName, authorAge, content, imageUrl },
    });

    return NextResponse.json({ success: true, data: testimony }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create testimony" },
      { status: 500 }
    );
  }
}
