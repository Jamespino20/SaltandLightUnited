import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const pubmats = await db.pubmat.findMany({
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
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, eventId } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and image URL are required" },
        { status: 400 }
      );
    }

    const pubmat = await db.pubmat.create({
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
