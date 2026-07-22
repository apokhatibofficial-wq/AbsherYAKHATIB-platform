import { getApprovedProfessionals } from "@/lib/supabase/queries";
import { SearchClient } from "./SearchClient";

export default async function SearchPage() {
  const professionals = await getApprovedProfessionals();
  return <SearchClient professionals={professionals} />;
}
