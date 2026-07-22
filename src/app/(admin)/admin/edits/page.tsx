import { getAdminEdits } from "@/lib/supabase/queries";
import { EditsClient } from "./EditsClient";

export default async function AdminEditsPage() {
  const edits = await getAdminEdits();
  return <EditsClient initialEdits={edits} />;
}
