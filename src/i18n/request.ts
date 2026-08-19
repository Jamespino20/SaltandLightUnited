import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";

const MESSAGES_DIR = path.join(process.cwd(), "messages");

const translationCache = new Map<
  string,
  { data: Record<string, string>; timestamp: number }
>();
const CACHE_TTL = 60_000; // 60 seconds

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

function buildNested(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [dottedKey, value] of Object.entries(flat)) {
    const parts = dottedKey.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

async function getMergedTranslations(locale: string): Promise<Record<string, unknown>> {
  const now = Date.now();
  const cached = translationCache.get(locale);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return buildNested(cached.data);
  }

  const jsonBase = readJsonFile(locale);
  const jsonFlat = flatten(jsonBase);

  let dbFlat: Record<string, string> = {};
  try {
    const dbTranslations = await prisma.translation.findMany({
      where: { locale },
    });
    for (const t of dbTranslations) {
      dbFlat[`${t.namespace}.${t.key}`] = t.value;
    }
  } catch {
    // DB unavailable, use JSON only
  }

  const merged = { ...jsonFlat, ...dbFlat };
  translationCache.set(locale, { data: merged, timestamp: now });

  return buildNested(merged);
}

export function clearTranslationCache(locale?: string) {
  if (locale) {
    translationCache.delete(locale);
  } else {
    translationCache.clear();
  }
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  const messages = await getMergedTranslations(locale);

  return {
    locale,
    messages,
  };
});
