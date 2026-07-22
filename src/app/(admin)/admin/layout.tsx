import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MOCK_ADMIN_REQUESTS, MOCK_PENDING_EDITS } from "@/lib/mock/data";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // TODO(supabase): fetch live pending counts instead of mock array lengths.
  const requestsCount = MOCK_ADMIN_REQUESTS.length;
  const editsCount = MOCK_PENDING_EDITS.filter((e) => e.status === "pending").length;

  return (
    <div className="flex min-h-dvh justify-center bg-backdrop p-6">
      <div className="flex min-h-[760px] w-full max-w-[1180px] overflow-hidden rounded-admin border border-border-light bg-white shadow-[0_20px_50px_rgba(6,61,43,0.15)]">
        <AdminSidebar requestsCount={requestsCount} editsCount={editsCount} />
        <div className="max-h-[760px] flex-1 overflow-y-auto bg-app-bg px-8.5 py-7.5">{children}</div>
      </div>
    </div>
  );
}
