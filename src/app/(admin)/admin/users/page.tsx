import { getAdminUsers } from "@/lib/supabase/queries";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return <UsersClient initialUsers={users} />;
}
