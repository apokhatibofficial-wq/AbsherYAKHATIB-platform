"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AccountStatusDb } from "@/lib/supabase/types";
import { SOCIAL_PLATFORMS } from "@/lib/ads";

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

export async function addFeaturedAction(professionalId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("featured_listings").insert({ professional_id: professionalId });
  if (error) return { error: "تعذر إضافة صاحب المهنة للقائمة" };
  revalidatePath("/admin/featured");
  return {};
}

export async function removeFeaturedAction(professionalId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("featured_listings").delete().eq("professional_id", professionalId);
  if (error) return { error: "تعذر إزالة صاحب المهنة من القائمة" };
  revalidatePath("/admin/featured");
  return {};
}

export async function createAdAction(
  formData: FormData
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "انتهت جلستك، سجّلي الدخول من جديد وحاولي مجددًا" };

  const name = (formData.get("name") as string)?.trim() || null;
  const externalUrl = (formData.get("externalUrl") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const locationUrl = (formData.get("locationUrl") as string)?.trim() || null;

  const socialLinks: Record<string, string> = {};
  for (const { key } of SOCIAL_PLATFORMS) {
    const value = (formData.get(`social_${key}`) as string)?.trim();
    if (value) socialLinks[key] = value;
  }

  const { data: ad, error } = await supabase
    .from("ads")
    .insert({ name, external_url: externalUrl, phone, location_url: locationUrl, social_links: socialLinks })
    .select("id")
    .single();
  if (error || !ad) return { error: "تعذر إنشاء الإعلان" };

  revalidatePath("/admin/ads");
  revalidatePath("/ads");
  return { id: ad.id };
}

/**
 * Returns a short-lived signed upload URL so the browser can send the image
 * bytes straight to Supabase Storage, bypassing our own server (whose
 * hosting platform caps request bodies well under a typical photo's size).
 */
export async function getAdImageUploadUrlAction(
  adId: string,
  ext: string
): Promise<{ path?: string; token?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "غير مصرح" };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "غير مصرح" };

  const path = `${adId}/${crypto.randomUUID()}.${ext}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("ads").createSignedUploadUrl(path);
  if (error || !data) return { error: "تعذر تجهيز رفع الصورة" };
  return { path: data.path, token: data.token };
}

export async function attachAdImagesAction(adId: string, imagePaths: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("ads").update({ image_paths: imagePaths }).eq("id", adId);
  if (error) return { error: "تعذر ربط الصور بالإعلان" };
  revalidatePath("/admin/ads");
  revalidatePath("/ads");
  return {};
}

export async function deleteAdAction(adId: string) {
  const supabase = await createClient();
  const { data: ad } = await supabase.from("ads").select("image_paths").eq("id", adId).single();
  if (ad?.image_paths?.length) {
    await supabase.storage.from("ads").remove(ad.image_paths);
  }
  const { error } = await supabase.from("ads").delete().eq("id", adId);
  if (error) return { error: "تعذر حذف الإعلان" };
  revalidatePath("/admin/ads");
  revalidatePath("/ads");
  return {};
}
