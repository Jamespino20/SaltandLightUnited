import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://assets.onedrive.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https://www.google.com/recaptcha/ https://assets.onedrive.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const CSRF_COOKIE = "slu.csrf-token";
const CSRF_HEADER = "x-csrf-token";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const isNextData = pathname.startsWith("/_next/");
  const isAuthRoute = pathname.startsWith("/api/auth/");

  const response = NextResponse.next();

  if (!isApiRoute) {
    const headers = response.headers;
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()",
    );
    headers.set("X-XSS-Protection", "0");
    headers.set("Content-Security-Policy", csp);
    headers.set("X-DNS-Prefetch-Control", "on");
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Resource-Policy", "same-origin");
    headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    headers.delete("X-Powered-By");
    headers.delete("Server");
  }

  if (!isNextData) {
    const existingToken = request.cookies.get(CSRF_COOKIE)?.value;
    if (!existingToken) {
      response.cookies.set(CSRF_COOKIE, generateToken(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }
  }

  const isStateChanging = request.method === "POST" || request.method === "PUT" || request.method === "DELETE" || request.method === "PATCH";

  if (isApiRoute && !isNextData && !isAuthRoute && isStateChanging) {
    const token = request.headers.get(CSRF_HEADER);
    const cookie = request.cookies.get(CSRF_COOKIE)?.value;

    if (!token || !cookie || token !== cookie) {
      return NextResponse.json(
        { success: false, error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    const sessionToken =
      request.cookies.get("slu.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value;

    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|images|sitemap.xml|robots.txt).*)",
    },
  ],
};
