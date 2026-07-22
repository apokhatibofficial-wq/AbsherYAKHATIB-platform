import { getApprovedProfessionals, getProfessions } from "@/lib/supabase/queries";
import { SearchClient } from "./SearchClient";

export default async function SearchPage() {
  const [professionals, professions] = await Promise.all([getApprovedProfessionals(), getProfessions()]);
  return <SearchClient professionals={professionals} professions={professions} />;
}
