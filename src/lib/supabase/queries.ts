import { createClient } from "@/lib/supabase/server";
import type { City, Profession, Professional, PendingEdit, AdminUser } from "@/types/domain";

function mapProfessional(row: {
  id: string;
  full_name: string;
  profession: string;
  city: string;
  phone: string;
  description: string;
  view_count: number;
  status: string;
  submitted_at: string;
}): Professional {
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
  };
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

  const rows = data.map(mapProfessional);
  const q = filters.query?.trim();
  if (!q) return rows;
  return rows.filter((p) => p.name.includes(q) || p.profession.includes(q));
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

  return { ...mapProfessional(row), galleryPhotoUrls };
}

export async function getFavoriteProfessionals(customerId: string): Promise<Professional[]> {
  const supabase = await createClient();
  const { data: favRows, error: favError } = await supabase
    .from("favorites")
    .select("professional_id")
    .eq("customer_id", customerId);
  if (favError || !favRows || favRows.length === 0) return [];

  const ids = favRows.map((r) => r.professional_id);
  const { data, error } = await supabase.from("professional_profiles").select("*").in("id", ids);
  if (error || !data) return [];
  return data.map(mapProfessional);
}

export async function getMyProfessionalProfile(userId: string): Promise<Professional | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("professional_profiles").select("*").eq("id", userId).single();
  if (error || !row) return null;
  return mapProfessional(row);
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
  supabase: Awaited<ReturnType<typeof createClient>>,
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
