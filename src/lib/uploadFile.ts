import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file straight from the browser to Supabase Storage using a
 * signed upload URL obtained from the server, so the file's bytes never
 * pass through our own Next.js/Vercel server (which caps request bodies
 * well under the size of a typical phone photo).
 */
export async function uploadViaSignedUrl(
  bucket: string,
  path: string,
  token: string,
  file: File
): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
  return error?.message ?? null;
}

export function fileExt(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() || "jpg";
}
