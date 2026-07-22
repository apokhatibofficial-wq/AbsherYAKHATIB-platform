"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns a short-lived signed upload URL so the browser can send the photo
 * bytes straight to Supabase Storage, bypassing our own server (whose
 * hosting platform caps request bodies well under a typical photo's size).
 */
export async function getAvatarUploadUrlAction(
  ext: string
): Promise<{ path?: string; token?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "غير مصرح" };

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("avatars").createSignedUploadUrl(path);
  if (error || !data) return { error: "تعذر تجهيز رفع الصورة" };
  return { path: data.path, token: data.token };
}

export async function finalizeAvatarAction(path: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const { error: rpcError } = await supabase.rpc("update_my_avatar", { p_avatar_url: pub.publicUrl });
  if (rpcError) return { error: "تعذر تحديث الصورة" };

  revalidatePath("/account");
  return {};
}

type EditableField = "description" | "phone";

export async function submitProfileEditsAction(input: {
  professionalId: string;
  currentDescription: string;
  currentPhone: string;
  newDescription: string;
  newPhone: string;
}) {
  const supabase = await createClient();

  const changes: { field: EditableField; oldValue: string; newValue: string }[] = [];
  if (input.newDescription !== input.currentDescription) {
    changes.push({ field: "description", oldValue: input.currentDescription, newValue: input.newDescription });
  }
  if (input.newPhone !== input.currentPhone) {
    changes.push({ field: "phone", oldValue: input.currentPhone, newValue: input.newPhone });
  }

  if (changes.length === 0) return { error: "لا توجد تغييرات لحفظها" };

  const { error } = await supabase.from("pending_edits").insert(
    changes.map((c) => ({
      professional_id: input.professionalId,
      field: c.field,
      old_value: c.oldValue,
      new_value: c.newValue,
    }))
  );
  if (error) return { error: "تعذر إرسال التعديل" };

  revalidatePath("/account");
  return {};
}
