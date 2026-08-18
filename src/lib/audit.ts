import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { Request } from "undici-types";

type LogRequest = {
  headers: { get(name: string): string | null };
};

interface AuditContext {
  action: string;
  targetTable?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAudit(
  session: Session | null,
  ctx: AuditContext,
  request?: LogRequest,
) {
  try {
    const ipAddress = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request?.headers.get("x-real-ip")
      || "unknown";

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id,
        action: ctx.action,
        targetTable: ctx.targetTable ?? null,
        targetId: ctx.targetId ?? null,
        ipAddress,
        userAgent: request?.headers.get("user-agent") ?? null,
        metadata: ctx.metadata as object ?? undefined,
      },
    });
  } catch {
    // Fail silently — audit logging should never break the main operation
  }
}

export const AUDIT_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LOGIN: "login",
  LOGIN_FAILED: "login_failed",
  LOGIN_LOCKED: "login_locked",
  LOGOUT: "logout",
  APPROVE: "approve",
  REJECT: "reject",
  UPLOAD: "upload",
  PASSWORD_CHANGE: "password_change",
  PASSWORD_RESET_REQUEST: "password_reset_request",
  PASSWORD_RESET: "password_reset",
} as const;
