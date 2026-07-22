import { getAdminFeaturedCandidates } from "@/lib/supabase/queries";
import { FeaturedClient } from "./FeaturedClient";

export default async function AdminFeaturedPage() {
  const candidates = await getAdminFeaturedCandidates();
  return <FeaturedClient initialCandidates={candidates} />;
}
