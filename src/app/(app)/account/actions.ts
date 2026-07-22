"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function changeAvatarAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "غير مصرح" };

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return { error: "يرجى اختيار صورة" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file);
  if (uploadError) return { error: "تعذر رفع الصورة" };

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
