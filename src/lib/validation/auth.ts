import { z } from "zod";
import { PROFESSIONS, CITIES } from "@/types/domain";

export const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(1, { message: "أدخل كلمة المرور" }),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const customerSignupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "الاسم قصير جدًا" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(8, { message: "8 أحرف على الأقل" }),
});
export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageFile = z
  .instanceof(File, { message: "الملف مطلوب" })
  .refine((f) => f.size <= MAX_FILE_BYTES, { message: "الحد الأقصى لحجم الملف 5 ميجابايت" })
  .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), { message: "صيغة الصورة غير مدعومة" });

export const professionalSignupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "الاسم قصير جدًا" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(8, { message: "8 أحرف على الأقل" }),
  phone: z
    .string()
    .trim()
    .regex(/^05\d{8}$/, { message: "رقم جوال سعودي غير صحيح (05xxxxxxxx)" }),
  profession: z.enum(PROFESSIONS, { message: "اختر المهنة" }),
  city: z.enum(CITIES, { message: "اختر المدينة" }),
  idFront: imageFile,
  idBack: imageFile,
  workPhotos: z.array(imageFile).max(3, { message: "3 صور كحد أقصى" }).optional(),
});
export type ProfessionalSignupInput = z.infer<typeof professionalSignupSchema>;
