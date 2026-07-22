"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  loginSchema,
  customerSignupSchema,
  professionalSignupSchema,
} from "@/lib/validation/auth";

export interface ActionResult {
  error?: string;
}

export async function loginAction(email: string, password: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", data.user.id)
    .single();

  if (profile?.status === "suspended") {
    await supabase.auth.signOut();
    return { error: "تم إيقاف هذا الحساب" };
  }

  if (profile?.role === "professional") {
    const { data: pro } = await supabase
      .from("professional_profiles")
      .select("status")
      .eq("id", data.user.id)
      .single();
    if (pro?.status !== "approved") redirect("/pending");
  }

  redirect("/home");
}

export async function customerSignupAction(input: {
  fullName: string;
  email: string;
  password: string;
  gender: string;
}): Promise<ActionResult> {
  const parsed = customerSignupSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName, role: "customer", gender: parsed.data.gender } },
  });
  if (error) return { error: error.message };

  redirect(`/verify-otp?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function verifyOtpAction(email: string, token: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" });
  if (error) return { error: "رمز التحقق غير صحيح" };
  redirect("/home");
}

export async function resendOtpAction(email: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) return { error: error.message };
  return {};
}

export async function professionalSignupAction(
  formData: FormData
): Promise<{ userId?: string; error?: string }> {
  const parsed = professionalSignupSchema
    .omit({ idFront: true, idBack: true, workPhotos: true })
    .safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      profession: formData.get("profession"),
      city: formData.get("city"),
      locationUrl: formData.get("locationUrl") || undefined,
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  const { fullName, email, password, phone, gender, profession, city, locationUrl } = parsed.data;

  // Regular signUp so the professional gets the normal confirmation email;
  // the service-role client below writes the related rows immediately,
  // sidestepping the fact there's no session yet (email unconfirmed).
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "professional", gender } },
  });
  if (error || !data.user) return { error: error?.message ?? "فشل إنشاء الحساب" };
  const userId = data.user.id;

  const admin = createAdminClient();

  const { error: profileError } = await admin.from("professional_profiles").insert({
    id: userId,
    full_name: fullName,
    profession,
    city,
    phone,
    location_url: locationUrl || null,
  });
  if (profileError) return { error: "فشل حفظ بيانات الملف المهني" };

  return { userId };
}

/**
 * Returns a short-lived signed upload URL so the browser can send an ID/work
 * photo straight to Supabase Storage, bypassing our own server (whose
 * hosting platform caps request bodies well under a typical photo's size).
 * Only issued for a professional still pending review, so a random id can't
 * be used to plant files in someone else's folder.
 */
export async function getProfessionalDocUploadUrlAction(
  userId: string,
  kind: "id_front" | "id_back" | "work_photo",
  ext: string
): Promise<{ path?: string; token?: string; bucket?: string; error?: string }> {
  const admin = createAdminClient();
  const { data: pending } = await admin
    .from("professional_profiles")
    .select("id")
    .eq("id", userId)
    .eq("status", "pending_review")
    .maybeSingle();
  if (!pending) return { error: "غير مصرح" };

  const bucket = kind === "work_photo" ? "work-photos" : "id-documents";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) return { error: "تعذر تجهيز رفع الصورة" };
  return { path: data.path, token: data.token, bucket };
}

export async function attachProfessionalDocumentAction(
  userId: string,
  kind: "id_front" | "id_back" | "work_photo",
  path: string
): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.from("professional_documents").insert({
    professional_id: userId,
    kind,
    storage_path: path,
  });
  if (error) return { error: "تعذر حفظ المستند" };
  return {};
}

export async function finishProfessionalSignupAction(): Promise<void> {
  redirect("/pending");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
