export const PROFESSIONS = [
  "سباك",
  "كهربائي",
  "نجار",
  "دهان",
  "تكييف وتبريد",
  "نظافة",
] as const;
export type Profession = (typeof PROFESSIONS)[number];

export const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة"] as const;
export type City = (typeof CITIES)[number];

export type UserRole = "customer" | "professional" | "admin";
export type AccountStatus = "active" | "suspended";
export type ProfessionalStatus = "pending_review" | "approved" | "rejected";
export type EditRequestStatus = "pending" | "approved" | "rejected";

export interface Professional {
  id: string;
  name: string;
  profession: Profession;
  city: City;
  phone: string;
  description: string;
  viewCount: number;
  status: ProfessionalStatus;
  galleryPhotoUrls: string[];
  submittedAt: string;
}

export interface PendingEdit {
  id: string;
  professionalId: string;
  professionalName: string;
  field: string;
  oldValue: string;
  newValue: string;
  status: EditRequestStatus;
  submittedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  status: AccountStatus;
}
