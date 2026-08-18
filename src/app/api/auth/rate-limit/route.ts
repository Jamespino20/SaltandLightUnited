import { NextResponse } from "next/server";
import { rateLimit, ipKey, emailKey } from "@/lib/rate-limit";

const LOGIN_RATE_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").toLowerCase().trim();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    const combinedKey = `${emailKey(email)}:${ipKey(ip)}`;

    const result = rateLimit(combinedKey, LOGIN_WINDOW_MS, LOGIN_RATE_LIMIT);

    if (result.limited) {
      return NextResponse.json({
        success: false,
        rateLimited: true,
        reset: result.reset,
      });
    }

    return NextResponse.json({
      success: true,
      rateLimited: false,
      remaining: result.remaining,
      reset: result.reset,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Rate limit check failed" },
      { status: 500 }
    );
  }
}
