/** Professions are open-ended — see the `professions` table / getProfessions(). */
export type Profession = string;

export const CITIES = [
  "إدلب",
  "معرة النعمان",
  "أريحا",
  "سراقب",
  "جسر الشغور",
  "حارم",
  "كفرنبل",
  "سلقين",
  "بنش",
  "دركوش",
  "الدانا",
  "خان شيخون",
] as const;
export type City = (typeof CITIES)[number];

export type UserRole = "customer" | "professional" | "admin";
export type AccountStatus = "active" | "suspended";
export type ProfessionalStatus = "pending_review" | "approved" | "rejected";
export type EditRequestStatus = "pending" | "approved" | "rejected";
export type Gender = "male" | "female";

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
  locationUrl: string | null;
  avgRating: number | null;
  ratingCount: number;
  gender: Gender | null;
  avatarUrl: string | null;
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
