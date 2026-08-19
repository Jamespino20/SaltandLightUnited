import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/api-auth";
import { clearTranslationCache } from "@/i18n/request";
import path from "path";
import fs from "fs";

const MESSAGES_DIR = path.join(process.cwd(), "messages");

function readJsonFile(locale: string): Record<string, unknown> {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "string") {
      result[fullKey] = val;
    } else if (typeof val === "object" && val !== null) {
      Object.assign(result, flatten(val as Record<string, unknown>, fullKey));
    }
  }
  return result;
}

export async function GET(req: NextRequest) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");
  const namespace = searchParams.get("namespace");

  if (!locale) {
    return NextResponse.json({ error: "locale is required" }, { status: 400 });
  }

  const dbTranslations = await prisma.translation.findMany({
    where: { locale },
  });

  const dbFlat: Record<string, string> = {};
  for (const t of dbTranslations) {
    dbFlat[`${t.namespace}.${t.key}`] = t.value;
  }

  const jsonBase = readJsonFile(locale);
  const jsonFlat = flatten(jsonBase);

  const merged = { ...jsonFlat, ...dbFlat };

  if (namespace) {
    const prefix = namespace + ".";
    const filtered: Record<string, string> = {};
    for (const [k, v] of Object.entries(merged)) {
      if (k.startsWith(prefix)) {
        filtered[k.slice(prefix.length)] = v;
      }
    }
    return NextResponse.json({
      success: true,
      data: { locale, namespace, translations: filtered },
    });
  }

  const namespaces: Record<string, Record<string, string>> = {};
  for (const [k, v] of Object.entries(merged)) {
    const dotIndex = k.indexOf(".");
    const ns = dotIndex === -1 ? "root" : k.slice(0, dotIndex);
    const key = dotIndex === -1 ? k : k.slice(dotIndex + 1);
    if (!namespaces[ns]) namespaces[ns] = {};
    namespaces[ns][key] = v;
  }

  return NextResponse.json({
    success: true,
    data: { locale, namespaces },
  });
}

export async function PUT(req: NextRequest) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  if (!authResult.session.user || !["admin", "editor"].includes(authResult.session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { locale, translations } = body as {
    locale: string;
    translations: Record<string, string>;
  };

  if (!locale || !translations || typeof translations !== "object") {
    return NextResponse.json(
      { error: "locale and translations object required" },
      { status: 400 }
    );
  }

  const ops = Object.entries(translations).map(([dottedKey, value]) => {
    const dotIndex = dottedKey.indexOf(".");
    const namespace = dotIndex === -1 ? "root" : dottedKey.slice(0, dotIndex);
    const key = dotIndex === -1 ? dottedKey : dottedKey.slice(dotIndex + 1);

    return prisma.translation.upsert({
      where: {
        locale_namespace_key: { locale, namespace, key },
      },
      update: { value },
      create: { locale, namespace, key, value },
    });
  });

  await prisma.$transaction(ops);
  clearTranslationCache(locale);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  if (!authResult.session.user || authResult.session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");
  const namespace = searchParams.get("namespace");
  const key = searchParams.get("key");

  if (!locale) {
    return NextResponse.json({ error: "locale required" }, { status: 400 });
  }

  const where: Record<string, unknown> = { locale };
  if (namespace) where.namespace = namespace;
  if (key) where.key = key;

  await prisma.translation.deleteMany({ where });
  clearTranslationCache(locale);

  return NextResponse.json({ success: true });
}
