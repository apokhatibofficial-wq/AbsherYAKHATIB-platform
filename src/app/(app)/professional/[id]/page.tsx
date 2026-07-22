import { notFound } from "next/navigation";
import { getProfessionalById, getMyRatingForProfessional } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalProfileClient } from "./ProfessionalProfileClient";

export default async function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [professional, user] = await Promise.all([getProfessionalById(id), getCurrentUser()]);
  if (!professional) notFound();

  const myRating = user ? await getMyRatingForProfessional(user.id, id) : null;

  const supabase = await createClient();
  await supabase.rpc("increment_professional_view", { p_professional_id: id });

  return <ProfessionalProfileClient professional={professional} myRating={myRating} />;
}
