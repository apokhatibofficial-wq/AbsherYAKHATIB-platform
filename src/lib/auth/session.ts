import { createClient } from "@/lib/supabase/server";
import type { UserRole, Gender } from "@/types/domain";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: Gender | null;
  avatarUrl: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, gender, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    gender: profile.gender,
    avatarUrl: profile.avatar_url,
  };
}
