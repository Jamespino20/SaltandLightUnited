import { NextResponse } from "next/server";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { invalidatePermissionsCache } from "@/lib/permissions";
import { clearTranslationCache } from "@/i18n/request";

export async function POST() {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "settings:update");
  if (permError) return permError;

  invalidatePermissionsCache();
  clearTranslationCache();

  return NextResponse.json({ success: true, message: "Cache cleared" });
}
