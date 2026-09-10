import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/blob";
import { requireSession, requirePermission } from "@/lib/api-auth";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB — safe margin under Vercel's 4.5MB serverless limit

export async function POST(request: Request) {
  const authResult = await requireSession();
  if (authResult instanceof NextResponse) return authResult;

  const permError = await requirePermission(authResult.session, "settings:update");
  if (permError) return permError;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      return NextResponse.json(
        { success: false, error: `File is too large. Maximum size is ${maxMB}MB.` },
        { status: 413 }
      );
    }

    const url = await uploadFile(file, folder);

    await logAudit(authResult.session, {
      action: AUDIT_ACTIONS.UPLOAD,
      targetTable: "upload",
      metadata: { filename: file.name, folder, url },
    }, request);

    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
