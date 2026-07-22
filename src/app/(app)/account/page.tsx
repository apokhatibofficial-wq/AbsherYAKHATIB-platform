import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyProfessionalProfile, getMyPendingEdit } from "@/lib/supabase/queries";
import { AccountView } from "./AccountView";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const professional = user.role === "professional" ? await getMyProfessionalProfile(user.id) : null;
  const pendingEdit = professional ? await getMyPendingEdit(professional.id) : null;

  return <AccountView user={user} professional={professional} hasPendingEdit={pendingEdit !== null} />;
}
