"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Textarea, Input } from "@/components/ui/Input";
import { UploadTile } from "@/components/ui/UploadTile";
import { ShieldIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { MOCK_PROFESSIONALS } from "@/lib/mock/data";
import type { CurrentUser } from "@/lib/auth/session";

const ROLE_LABELS: Record<CurrentUser["role"], string> = {
  customer: "عميل",
  professional: "صاحب مهنة",
  admin: "مدير",
};

export function AccountView({ user }: { user: CurrentUser }) {
  return (
    <div className="px-5 py-5">
      <h1 className="mb-4 text-[19px] font-extrabold text-text-primary">حسابي</h1>

      <div className="mb-[18px] flex items-center gap-3.5 rounded-card border border-border-light bg-white p-4">
        <Avatar name={user.name} id={user.id} size={52} />
        <div>
          <div className="text-[15px] font-bold text-text-primary">{user.name}</div>
          <div className="text-[12.5px] text-text-muted">{ROLE_LABELS[user.role]}</div>
        </div>
      </div>

      {user.role === "customer" && <CustomerActions />}
      {user.role === "professional" && <ProfessionalDashboard />}
      {user.role === "admin" && <AdminEntry />}
    </div>
  );
}

function CustomerActions() {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="subtleOutline"
      fullWidth
      className="!text-danger"
      onClick={() => {
        // TODO(supabase): supabase.auth.signOut()
        router.push("/login");
      }}
    >
      تسجيل الخروج
    </Button>
  );
}

function ProfessionalDashboard() {
  const { showToast } = useToast();
  // TODO(supabase): source from the authenticated professional's own row + their latest pending_edits entry.
  const professional = MOCK_PROFESSIONALS[0];
  const [description, setDescription] = useState(professional.description);
  const [phone, setPhone] = useState(professional.phone);
  const [pendingEdit, setPendingEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    // TODO(supabase): insert into `pending_edits` (old/new diff) — never write directly to the live profile.
    await new Promise((r) => setTimeout(r, 300));
    setPendingEdit(true);
    setSaving(false);
    showToast("تم إرسال التعديل للمراجعة");
  }

  return (
    <div>
      <h2 className="mb-2.5 text-sm font-bold text-text-primary">لوحتي كصاحب مهنة</h2>

      {pendingEdit && (
        <div className="mb-3.5 rounded-xl border border-warning-border bg-warning-bg px-3.5 py-3 text-[12.5px] leading-[1.7] text-warning-text">
          تعديلك الأخير على الملف بانتظار موافقة الإدارة ولن يظهر للمستخدمين حتى تتم مراجعته.
        </div>
      )}

      <div className="mb-4 rounded-card border border-border-light bg-white p-4">
        <div className="mb-3.5 flex items-center gap-3">
          <Avatar name={professional.name} id={professional.id} size={48} />
          <div>
            <div className="text-[14.5px] font-bold text-text-primary">{professional.name}</div>
            <div className="text-[12.5px] text-text-muted">
              {professional.profession} · {professional.city}
            </div>
          </div>
        </div>

        <Textarea
          label="وصف الخدمة"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input label="رقم التواصل" ltr value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label className="mb-1.5 block text-[12.5px] font-semibold text-text-secondary">إضافة صور أعمال</label>
        <UploadTile name="newWorkPhoto" height={56} className="mb-1.5" />
      </div>

      <Button type="button" fullWidth disabled={saving} onClick={handleSave}>
        حفظ التعديلات
      </Button>
    </div>
  );
}

function AdminEntry() {
  const router = useRouter();
  return (
    <Button type="button" variant="dark" fullWidth onClick={() => router.push("/admin/requests")}>
      <ShieldIcon size={17} />
      الدخول إلى لوحة الإدارة
    </Button>
  );
}
