import type { Professional, PendingEdit, AdminUser } from "@/types/domain";

/** Illustrative content only, per design handoff — replaced by live Supabase data in the real build. */
export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "أحمد الغامدي",
    profession: "سباك",
    city: "الرياض",
    phone: "0555123456",
    description:
      "فني سباكة معتمد بخبرة 8 سنوات في تركيب وصيانة أنظمة المياه والصرف الصحي للمنازل والفلل.",
    viewCount: 128,
    status: "approved",
    galleryPhotoUrls: ["", "", "", ""],
    submittedAt: "2026-06-01",
  },
  {
    id: "2",
    name: "سالم القحطاني",
    profession: "كهربائي",
    city: "جدة",
    phone: "0555987654",
    description: "كهربائي منازل معتمد، تمديدات كهربائية وصيانة أعطال بشكل آمن وسريع.",
    viewCount: 94,
    status: "approved",
    galleryPhotoUrls: ["", "", "", ""],
    submittedAt: "2026-06-03",
  },
  {
    id: "3",
    name: "فيصل العتيبي",
    profession: "نجار",
    city: "الدمام",
    phone: "0555456789",
    description: "نجار محترف لتفصيل وتركيب الأثاث الخشبي والمطابخ حسب الطلب.",
    viewCount: 67,
    status: "approved",
    galleryPhotoUrls: ["", "", "", ""],
    submittedAt: "2026-06-05",
  },
];

export const MOCK_ADMIN_REQUESTS: Professional[] = [
  {
    id: "101",
    name: "خالد المطيري",
    profession: "دهان",
    city: "الرياض",
    phone: "0501112222",
    description: "",
    viewCount: 0,
    status: "pending_review",
    galleryPhotoUrls: [],
    submittedAt: "قبل يومين",
  },
  {
    id: "102",
    name: "يوسف الشهري",
    profession: "تكييف وتبريد",
    city: "مكة المكرمة",
    phone: "0533334444",
    description: "",
    viewCount: 0,
    status: "pending_review",
    galleryPhotoUrls: [],
    submittedAt: "قبل 5 أيام",
  },
];

export const MOCK_PENDING_EDITS: PendingEdit[] = [
  {
    id: "201",
    professionalId: "1",
    professionalName: "أحمد الغامدي",
    field: "الوصف",
    oldValue: "فني سباكة عام.",
    newValue: "فني سباكة معتمد بخبرة 8 سنوات في تركيب وصيانة أنظمة المياه والصرف الصحي.",
    status: "pending",
    submittedAt: "اليوم",
  },
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "1", name: "محمد عبدالله", role: "customer", email: "m.abdullah@mail.com", status: "active" },
  { id: "2", name: "أحمد الغامدي", role: "professional", email: "ahmed.g@mail.com", status: "active" },
  { id: "3", name: "سالم القحطاني", role: "professional", email: "salem.q@mail.com", status: "active" },
  { id: "4", name: "نورة السالم", role: "customer", email: "noura.s@mail.com", status: "suspended" },
];
