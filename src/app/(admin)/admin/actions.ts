"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AccountStatusDb } from "@/lib/supabase/types";

export async function approveRequestAction(professionalId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("approve_professional_request", { p_professional_id: professionalId });
  if (error) return { error: "تعذر قبول الطلب" };
  revalidatePath("/admin/requests");
  return {};
}

export async function rejectRequestAction(professionalId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reject_professional_request", { p_professional_id: professionalId });
  if (error) return { error: "تعذر رفض الطلب" };
  revalidatePath("/admin/requests");
  return {};
}

export async function approveEditAction(editId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("approve_pending_edit", { p_edit_id: editId });
  if (error) return { error: "تعذر اعتماد التعديل" };
  revalidatePath("/admin/edits");
  return {};
}

export async function rejectEditAction(editId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reject_pending_edit", { p_edit_id: editId });
  if (error) return { error: "تعذر رفض التعديل" };
  revalidatePath("/admin/edits");
  return {};
}

export async function setUserStatusAction(userId: string, status: AccountStatusDb) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_user_status", { p_user_id: userId, p_status: status });
  if (error) return { error: "تعذر تحديث حالة الحساب" };
  revalidatePath("/admin/users");
  return {};
}
