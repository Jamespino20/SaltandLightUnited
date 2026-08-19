import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
    if (!config) {
      config = await prisma.siteConfig.create({ data: { id: "singleton" } });
    }
    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch site config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "settings:update");
  if (permError) return permError;

  try {
    const body = await request.json();

    // Ensure config row exists
    await prisma.siteConfig.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    });

    const allowedFields = [
      "siteName", "siteShortName", "tagline", "description", "city",
      "facebookUrl", "phones", "logoUrl", "faviconUrl",
      "heroTitle1", "heroTitle2", "heroSubtitle",
      "aboutTitle", "aboutDescription", "independenceNote",
      "maintenanceMode", "maintenanceMessage",
      "notifyNewDevotional", "notifyNewTestimony", "notifyNewPubmat", "notifyNewUser",
    ] as const;

    const data: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        data[key] = body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const config = await prisma.siteConfig.update({
      where: { id: "singleton" },
      data,
    });

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPDATE,
      targetTable: "site_config",
      targetId: "singleton",
      metadata: { fields: Object.keys(data) },
    }, request);

    return NextResponse.json({ success: true, data: config });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update site config" },
      { status: 500 }
    );
  }
}
