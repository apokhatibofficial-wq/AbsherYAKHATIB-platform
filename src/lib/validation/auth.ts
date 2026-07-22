import { z } from "zod";
import { CITIES } from "@/types/domain";

export const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(1, { message: "أدخل كلمة المرور" }),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const genderSchema = z.enum(["male", "female"], { message: "اختر الجنس" });

export const customerSignupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "الاسم قصير جدًا" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z.string().min(8, { message: "8 أحرف على الأقل" }),
  gender: genderSchema,
});
export type CustomerSignupInput = z.infer<typeof customerSignupSchema>;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/gif",
];

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
    .regex(/^09\d{8}$/, { message: "رقم جوال سوري غير صحيح (09xxxxxxxx)" }),
  gender: genderSchema,
  profession: z.string().trim().min(2, { message: "أدخل المهنة" }).max(50, { message: "اسم المهنة طويل جدًا" }),
  city: z.enum(CITIES, { message: "اختر المدينة" }),
  locationUrl: z
    .string()
    .trim()
    .url({ message: "رابط غير صحيح" })
    .optional()
    .or(z.literal("")),
  idFront: imageFile,
  idBack: imageFile,
  workPhotos: z.array(imageFile).max(3, { message: "3 صور كحد أقصى" }).optional(),
});
export type ProfessionalSignupInput = z.infer<typeof professionalSignupSchema>;
