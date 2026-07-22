import { createClient } from "@/lib/supabase/server";
import type { City, Profession, Professional, PendingEdit, AdminUser } from "@/types/domain";

type ProfessionalRow = {
  id: string;
  full_name: string;
  profession: string;
  city: string;
  phone: string;
  description: string;
  view_count: number;
  status: string;
  submitted_at: string;
  location_url: string | null;
};

function mapProfessional(row: ProfessionalRow): Professional {
  return {
    id: row.id,
    name: row.full_name,
    profession: row.profession as Profession,
    city: row.city as City,
    phone: row.phone,
    description: row.description,
    viewCount: row.view_count,
    status: row.status as Professional["status"],
    galleryPhotoUrls: [],
    submittedAt: row.submitted_at,
    locationUrl: row.location_url,
    avgRating: null,
    ratingCount: 0,
    gender: null,
    avatarUrl: null,
  };
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** Merges in average rating + gender/avatar (from `profiles`, since professional_profiles.id === profiles.id). */
async function enrichProfessionals(
  supabase: SupabaseServerClient,
  professionals: Professional[]
): Promise<Professional[]> {
  if (professionals.length === 0) return professionals;
  const ids = professionals.map((p) => p.id);

  const [{ data: ratingRows }, { data: profileRows }] = await Promise.all([
    supabase.from("ratings").select("professional_id, stars").in("professional_id", ids),
    supabase.from("profiles").select("id, gender, avatar_url").in("id", ids),
  ]);

  const ratingById = new Map<string, { sum: number; count: number }>();
  for (const row of ratingRows ?? []) {
    const entry = ratingById.get(row.professional_id) ?? { sum: 0, count: 0 };
    entry.sum += row.stars;
    entry.count += 1;
    ratingById.set(row.professional_id, entry);
  }
  const profileById = new Map((profileRows ?? []).map((r) => [r.id, r]));

  return professionals.map((p) => {
    const rating = ratingById.get(p.id);
    const profile = profileById.get(p.id);
    return {
      ...p,
      avgRating: rating ? Math.round((rating.sum / rating.count) * 10) / 10 : null,
      ratingCount: rating?.count ?? 0,
      gender: profile?.gender ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    };
  });
}

export async function getProfessions(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("professions").select("name").order("name");
  if (error || !data) return [];
  return data.map((row) => row.name);
}

export interface ProfessionalFilters {
  profession?: string;
  city?: string;
  query?: string;
}

export async function getApprovedProfessionals(filters: ProfessionalFilters = {}): Promise<Professional[]> {
  const supabase = await createClient();
  let queryBuilder = supabase.from("professional_profiles").select("*").eq("status", "approved");

  if (filters.profession) queryBuilder = queryBuilder.eq("profession", filters.profession);
  if (filters.city) queryBuilder = queryBuilder.eq("city", filters.city);

  const { data, error } = await queryBuilder.order("submitted_at", { ascending: false });
  if (error || !data) return [];

  let rows = data.map(mapProfessional);
  const q = filters.query?.trim();
  if (q) rows = rows.filter((p) => p.name.includes(q) || p.profession.includes(q));
  return enrichProfessionals(supabase, rows);
}

export async function getProfessionalById(id: string): Promise<Professional | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("professional_profiles").select("*").eq("id", id).single();
  if (error || !row) return null;

  const { data: docs } = await supabase
    .from("professional_documents")
    .select("storage_path")
    .eq("professional_id", id)
    .eq("kind", "work_photo");

  const galleryPhotoUrls = (docs ?? []).map(
    (d) => supabase.storage.from("work-photos").getPublicUrl(d.storage_path).data.publicUrl
  );

  const [withRating] = await enrichProfessionals(supabase, [{ ...mapProfessional(row), galleryPhotoUrls }]);
  return withRating;
}

export async function getMyRatingForProfessional(customerId: string, professionalId: string): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ratings")
    .select("stars")
    .eq("customer_id", customerId)
    .eq("professional_id", professionalId)
    .maybeSingle();
  return data?.stars ?? null;
}

export async function getFeaturedProfessionals(): Promise<Professional[]> {
  const supabase = await createClient();
  const { data: featured, error } = await supabase.from("featured_listings").select("professional_id");
  if (error || !featured || featured.length === 0) return [];

  const ids = featured.map((f) => f.professional_id);
  const { data, error: proError } = await supabase.from("professional_profiles").select("*").in("id", ids);
  if (proError || !data) return [];

  const rows = await enrichProfessionals(supabase, data.map(mapProfessional));
  return rows.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
}

export async function getMyProfessionalProfile(userId: string): Promise<Professional | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("professional_profiles").select("*").eq("id", userId).single();
  if (error || !row) return null;
  const [withExtras] = await enrichProfessionals(supabase, [mapProfessional(row)]);
  return withExtras;
}

export async function getMyPendingEdit(professionalId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pending_edits")
    .select("*")
    .eq("professional_id", professionalId)
    .eq("status", "pending")
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

// --- Admin queries ---------------------------------------------------------

export interface AdminProfessionalRequest extends Professional {
  idFrontUrl: string | null;
  idBackUrl: string | null;
  workPhotoUrls: string[];
}

export async function getAdminRequests(): Promise<AdminProfessionalRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("professional_profiles")
    .select("*")
    .eq("status", "pending_review")
    .order("submitted_at", { ascending: true });
  if (error || !data || data.length === 0) return [];

  const ids = data.map((row) => row.id);
  const { data: docs } = await supabase
    .from("professional_documents")
    .select("professional_id, kind, storage_path")
    .in("professional_id", ids);

  const docsByProfessional = new Map<string, typeof docs>();
  for (const doc of docs ?? []) {
    const list = docsByProfessional.get(doc.professional_id) ?? [];
    list.push(doc);
    docsByProfessional.set(doc.professional_id, list);
  }

  return Promise.all(
    data.map(async (row) => {
      const ownDocs = docsByProfessional.get(row.id) ?? [];
      const idFront = ownDocs.find((d) => d.kind === "id_front");
      const idBack = ownDocs.find((d) => d.kind === "id_back");
      const workPhotos = ownDocs.filter((d) => d.kind === "work_photo");

      const [idFrontUrl, idBackUrl, workPhotoUrls] = await Promise.all([
        idFront ? signedUrl(supabase, "id-documents", idFront.storage_path) : Promise.resolve(null),
        idBack ? signedUrl(supabase, "id-documents", idBack.storage_path) : Promise.resolve(null),
        Promise.all(workPhotos.map((d) => signedUrl(supabase, "work-photos", d.storage_path))),
      ]);

      return {
        ...mapProfessional(row),
        idFrontUrl,
        idBackUrl,
        workPhotoUrls: workPhotoUrls.filter((u): u is string => u !== null),
      };
    })
  );
}

async function signedUrl(
  supabase: SupabaseServerClient,
  bucket: "id-documents" | "work-photos",
  path: string
): Promise<string | null> {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
  return data?.signedUrl ?? null;
}

export async function getAdminEdits(): Promise<PendingEdit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pending_edits")
    .select("*")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true });
  if (error || !data || data.length === 0) return [];

  const professionalIds = [...new Set(data.map((row) => row.professional_id))];
  const { data: pros } = await supabase
    .from("professional_profiles")
    .select("id, full_name")
    .in("id", professionalIds);
  const nameById = new Map((pros ?? []).map((p) => [p.id, p.full_name]));

  return data.map((row) => ({
    id: row.id,
    professionalId: row.professional_id,
    professionalName: nameById.get(row.professional_id) ?? "",
    field: row.field,
    oldValue: row.old_value ?? "",
    newValue: row.new_value,
    status: row.status,
    submittedAt: row.submitted_at,
  }));
}

export async function getAdminCounts(): Promise<{ requestsCount: number; editsCount: number }> {
  const supabase = await createClient();
  const [requests, edits] = await Promise.all([
    supabase.from("professional_profiles").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("pending_edits").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return { requestsCount: requests.count ?? 0, editsCount: edits.count ?? 0 };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, email, status")
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.full_name,
    role: row.role,
    email: row.email,
    status: row.status,
  }));
}

export interface FeaturedCandidate {
  id: string;
  name: string;
  profession: string;
  city: string;
  featured: boolean;
}

export async function getAdminFeaturedCandidates(): Promise<FeaturedCandidate[]> {
  const supabase = await createClient();
  const [{ data: pros }, { data: featured }] = await Promise.all([
    supabase
      .from("professional_profiles")
      .select("id, full_name, profession, city")
      .eq("status", "approved")
      .order("full_name"),
    supabase.from("featured_listings").select("professional_id"),
  ]);

  const featuredIds = new Set((featured ?? []).map((f) => f.professional_id));
  return (pros ?? []).map((p) => ({
    id: p.id,
    name: p.full_name,
    profession: p.profession,
    city: p.city,
    featured: featuredIds.has(p.id),
  }));
}
