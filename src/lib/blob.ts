import { put } from "@vercel/blob";

export async function uploadFile(file: File, folder: string): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const blob = await put(filename, file, {
    access: "public",
  });

  return blob.url;
}
