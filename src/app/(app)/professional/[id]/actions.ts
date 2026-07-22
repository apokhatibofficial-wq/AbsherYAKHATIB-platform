"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function rateProfessionalAction(professionalId: string, stars: number) {
  if (stars < 1 || stars > 5) return { error: "تقييم غير صحيح" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول" };

  const { error } = await supabase
    .from("ratings")
    .upsert({ professional_id: professionalId, customer_id: user.id, stars }, { onConflict: "customer_id,professional_id" });
  if (error) return { error: "تعذر إرسال التقييم" };

  revalidatePath(`/professional/${professionalId}`);
  return {};
}
