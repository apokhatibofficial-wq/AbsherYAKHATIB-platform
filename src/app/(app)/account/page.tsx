import { getCurrentUser } from "@/lib/auth/session";
import { AccountView } from "./AccountView";

export default async function AccountPage() {
  const user = await getCurrentUser();
  return <AccountView user={user} />;
}
