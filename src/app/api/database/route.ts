import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";

const ALLOWED_MODELS = [
  "event",
  "devotional",
  "testimony",
  "pubmat",
  "group",
  "resource",
  "user",
  "session",
  "chatHistory",
  "auditLog",
  "visitorLog",
  "siteSetting",
] as const;

type AllowedModel = (typeof ALLOWED_MODELS)[number];

const MODEL_DISPLAY: Record<AllowedModel, string> = {
  event: "Events",
  devotional: "Devotionals",
  testimony: "Testimonies",
  pubmat: "Pubmats",
  group: "Groups",
  resource: "Resources",
  user: "Users",
  session: "Sessions",
  chatHistory: "Chat History",
  auditLog: "Audit Logs",
  visitorLog: "Visitor Logs",
  siteSetting: "Site Settings",
};

const MODEL_COLUMNS: Record<AllowedModel, string[]> = {
  event: ["id", "title", "description", "date", "location", "imageUrl", "featured", "createdAt"],
  devotional: ["id", "title", "content", "author", "scriptureRef", "imageUrl", "publishedAt", "createdAt"],
  testimony: ["id", "authorName", "authorAge", "content", "imageUrl", "approved", "createdAt"],
  pubmat: ["id", "title", "description", "imageUrl", "category", "eventId", "createdAt"],
  group: ["id", "name", "description", "meetingSchedule", "leader", "imageUrl", "createdAt"],
  resource: ["id", "title", "type", "content", "fileUrl", "thumbnailUrl", "createdAt"],
  user: ["id", "email", "name", "role", "createdAt"],
  session: ["id", "userId", "token", "expiresAt", "lastActiveAt", "createdAt"],
  chatHistory: ["id", "sessionId", "role", "content", "createdAt"],
  auditLog: ["id", "userId", "action", "targetTable", "targetId", "ipAddress", "country", "city", "createdAt"],
  visitorLog: ["id", "sessionId", "path", "ipAddress", "country", "city", "createdAt"],
  siteSetting: ["key", "value", "updatedAt"],
};

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function GET(request: NextRequest) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model") as AllowedModel | null;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "25", 10)));
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "createdAt";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const inspectId = searchParams.get("inspectId");

  if (!model) {
    return NextResponse.json({
      success: true,
      data: {
        models: ALLOWED_MODELS.map((m) => ({ key: m, label: MODEL_DISPLAY[m], columns: MODEL_COLUMNS[m] })),
      },
    });
  }

  if (!ALLOWED_MODELS.includes(model)) {
    return NextResponse.json({ success: false, error: "Invalid model" }, { status: 400 });
  }

  try {
    const prismaClient = prisma as unknown as Record<string, unknown>;
    const prismaModel = prismaClient[model] as {
      findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
      count: (args: Record<string, unknown>) => Promise<number>;
      findUnique: (args: Record<string, unknown>) => Promise<unknown>;
    };

    if (!prismaModel) {
      return NextResponse.json({ success: false, error: "Model not found" }, { status: 400 });
    }

    if (inspectId) {
      const record = await prismaModel.findUnique({
        where: { id: inspectId },
      });
      return NextResponse.json({ success: true, data: record });
    }

    const columns = MODEL_COLUMNS[model];
    const searchableColumns = columns.filter(
      (c) => !["id", "createdAt", "updatedAt", "featured", "approved", "expiresAt", "lastActiveAt", "publishedAt"].includes(c)
    );

    const where: Record<string, unknown> = {};
    if (search && searchableColumns.length > 0) {
      where.OR = searchableColumns.map((col) => ({
        [col]: { contains: search, mode: "insensitive" },
      }));
    }

    const validSortField = columns.includes(sortField) ? sortField : "createdAt";

    const [rows, total] = await Promise.all([
      prismaModel.findMany({
        where,
        orderBy: { [validSortField]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prismaModel.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: rows,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        model,
        columns,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
