import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { verifyPassword } from "@/lib/password";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { newEmail, password } = body;

    if (!newEmail || !password) {
      return NextResponse.json(
        { success: false, error: "New email and current password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = newEmail.toLowerCase().trim();

    if (normalizedEmail === authResult.session.user.email) {
      return NextResponse.json(
        { success: false, error: "New email must be different from current email" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.session.user.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(
        { success: false, error: "No password set on this account" },
        { status: 400 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 403 }
      );
    }

    await prisma.emailChangeRequest.deleteMany({
      where: {
        userId: authResult.session.user.id,
        verified: false,
      },
    });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.emailChangeRequest.create({
      data: {
        userId: authResult.session.user.id,
        newEmail: normalizedEmail,
        token,
        expiresAt,
      },
    });

    await logAudit(authResult.session, {
      action: "email_change_requested",
      targetTable: "user",
      targetId: authResult.session.user.id,
      metadata: { newEmail: normalizedEmail },
    }, request);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/profile/email-change?token=${token}`;

    console.log(`\n📧 Email change verification link:\n${verifyUrl}\n`);

    return NextResponse.json({
      success: true,
      message: "Verification link has been sent to your new email. Please check your inbox.",
      _dev: process.env.NODE_ENV !== "production" ? verifyUrl : undefined,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to initiate email change" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing verification token" },
      { status: 400 }
    );
  }

  try {
    const request_record = await prisma.emailChangeRequest.findUnique({
      where: { token },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!request_record) {
      return NextResponse.json(
        { success: false, error: "Invalid verification token" },
        { status: 404 }
      );
    }

    if (request_record.verified) {
      return NextResponse.json(
        { success: false, error: "This verification link has already been used" },
        { status: 410 }
      );
    }

    if (request_record.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "This verification link has expired" },
        { status: 410 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: request_record.newEmail },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: request_record.userId },
      data: { email: request_record.newEmail },
    });

    await prisma.emailChangeRequest.update({
      where: { id: request_record.id },
      data: { verified: true },
    });

    await prisma.session.deleteMany({
      where: { userId: request_record.userId },
    });

    await logAudit(null, {
      action: "email_change_completed",
      targetTable: "user",
      targetId: request_record.userId,
      metadata: {
        oldEmail: request_record.user.email,
        newEmail: request_record.newEmail,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(
      new URL("/login?emailChanged=1", baseUrl)
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to verify email change" },
      { status: 500 }
    );
  }
}
