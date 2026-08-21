import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const requests = await prisma.prayerRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: requests });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch prayer requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded?.split(",")[0]?.trim() || null;

    const prayerRequest = await prisma.prayerRequest.create({
      data: {
        message: message.trim(),
        ipAddress,
      },
    });

    return NextResponse.json({ success: true, data: prayerRequest }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit prayer request" },
      { status: 500 }
    );
  }
}
