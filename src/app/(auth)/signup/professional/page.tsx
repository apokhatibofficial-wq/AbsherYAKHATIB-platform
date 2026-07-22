import { getProfessions } from "@/lib/supabase/queries";
import { ProfessionalSignupForm } from "./ProfessionalSignupForm";

export default async function ProfessionalSignupPage() {
  const professions = await getProfessions();
  return <ProfessionalSignupForm professions={professions} />;
}
