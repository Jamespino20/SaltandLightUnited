import { NextResponse } from "next/server";
import { getFacebookEmbed } from "@/lib/facebook";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { success: false, error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    const embed = await getFacebookEmbed(url);
    return NextResponse.json({ success: true, data: embed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch embed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
