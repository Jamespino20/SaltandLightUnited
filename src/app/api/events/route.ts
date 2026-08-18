import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { title, description, date, location, imageUrl, featured } = body;

    if (!title || !date) {
      return NextResponse.json(
        { success: false, error: "Title and date are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: { title, description, date: new Date(date), location, imageUrl, featured },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}
