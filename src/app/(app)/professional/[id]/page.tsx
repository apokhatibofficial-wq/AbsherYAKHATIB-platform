import { notFound } from "next/navigation";
import { getProfessionalById } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalProfileClient } from "./ProfessionalProfileClient";

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const professional = await getProfessionalById(id);
  if (!professional) notFound();

  const supabase = await createClient();
  await supabase.rpc("increment_professional_view", { p_professional_id: id });

  return <ProfessionalProfileClient professional={professional} />;
}
