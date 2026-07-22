import type { UserRole } from "@/types/domain";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * TODO(supabase): replace with a real session lookup via `@supabase/ssr`
 * (createServerClient + auth.getUser(), joined with the `profiles` table for role).
 * Returns a fixed customer session so the app shell is navigable before Supabase is wired.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    id: "mock-user",
    name: "محمد عبدالله",
    email: "m.abdullah@mail.com",
    role: "customer",
  };
}
