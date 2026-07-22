import { getAdminRequests } from "@/lib/supabase/queries";
import { RequestsClient } from "./RequestsClient";

export default async function AdminRequestsPage() {
  const requests = await getAdminRequests();
  return <RequestsClient initialRequests={requests} />;
}
