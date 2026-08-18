import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getGeoFromIP } from "@/lib/geo";

interface AuditParams {
  userId?: string;
  action: string;
  targetTable?: string;
  targetId?: string;
  request?: NextRequest;
  metadata?: Record<string, unknown>;
}

function getClientIP(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? null;
}

export async function logAudit({
  userId,
  action,
  targetTable,
  targetId,
  request,
  metadata,
}: AuditParams): Promise<void> {
  let ipAddress: string | null = null;
  let country: string | null = null;
  let city: string | null = null;
  let userAgent: string | null = null;

  if (request) {
    ipAddress = getClientIP(request);
    userAgent = request.headers.get("user-agent") ?? null;

    if (ipAddress) {
      const geo = await getGeoFromIP(ipAddress);
      if (geo) {
        country = geo.country;
        city = geo.city;
      }
    }
  }

  await prisma.auditLog.create({
    data: {
      userId,
      action,
      targetTable,
      targetId,
      ipAddress,
      country,
      city,
      userAgent,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    },
  });
}
