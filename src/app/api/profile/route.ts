import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, avatarUrl, phone, bio, currentPassword } = body;

    if (currentPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { passwordHash: true },
      });

      if (!user?.passwordHash) {
        return NextResponse.json(
          { success: false, error: "No password set on this account" },
          { status: 400 }
        );
      }

      const ok = await verifyPassword(currentPassword, user.passwordHash);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 403 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(bio !== undefined && { bio: bio || null }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        bio: true,
      },
    });

    await logAudit(session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "user",
      targetId: updated.id,
      metadata: { fields: Object.keys(body).filter((k) => k !== "currentPassword") },
    }, request);

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
