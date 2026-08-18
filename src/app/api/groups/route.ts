import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: groups });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { name, description, meetingSchedule, leader, imageUrl } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const group = await prisma.group.create({
      data: { name, description, meetingSchedule, leader, imageUrl },
    });

    return NextResponse.json({ success: true, data: group }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create group" },
      { status: 500 }
    );
  }
}
