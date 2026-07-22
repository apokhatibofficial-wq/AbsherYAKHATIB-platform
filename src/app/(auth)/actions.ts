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
}): Promise<ActionResult> {
  const parsed = customerSignupSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName, role: "customer" } },
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

export async function professionalSignupAction(formData: FormData): Promise<ActionResult> {
  const parsed = professionalSignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    profession: formData.get("profession"),
    city: formData.get("city"),
    locationUrl: formData.get("locationUrl") || undefined,
    idFront: formData.get("idFront"),
    idBack: formData.get("idBack"),
    workPhotos: formData.getAll("workPhotos").filter((f): f is File => f instanceof File && f.size > 0),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  const { fullName, email, password, phone, profession, city, locationUrl, idFront, idBack, workPhotos } = parsed.data;

  // Regular signUp so the professional gets the normal confirmation email;
  // the service-role client below writes the related rows immediately,
  // sidestepping the fact there's no session yet (email unconfirmed).
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "professional" } },
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

  const uploads: { file: File; kind: "id_front" | "id_back" | "work_photo"; bucket: "id-documents" | "work-photos" }[] = [
    { file: idFront, kind: "id_front", bucket: "id-documents" },
    { file: idBack, kind: "id_back", bucket: "id-documents" },
    ...(workPhotos ?? []).map((file) => ({ file, kind: "work_photo" as const, bucket: "work-photos" as const })),
  ];

  for (const upload of uploads) {
    const ext = upload.file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await admin.storage.from(upload.bucket).upload(path, upload.file);
    if (uploadError) continue;
    await admin.from("professional_documents").insert({
      professional_id: userId,
      kind: upload.kind,
      storage_path: path,
    });
  }

  redirect("/pending");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
