"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Textarea, Input } from "@/components/ui/Input";
import { UploadTile } from "@/components/ui/UploadTile";
import { ShieldIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import type { CurrentUser } from "@/lib/auth/session";
import type { Professional } from "@/types/domain";
import { logoutAction } from "../../(auth)/actions";
import { submitProfileEditsAction } from "./actions";

const ROLE_LABELS: Record<CurrentUser["role"], string> = {
  customer: "عميل",
  professional: "صاحب مهنة",
  admin: "مدير",
};

interface AccountViewProps {
  user: CurrentUser;
  professional: Professional | null;
  hasPendingEdit: boolean;
}

export function AccountView({ user, professional, hasPendingEdit }: AccountViewProps) {
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
      {user.role === "professional" && professional && (
        <ProfessionalDashboard professional={professional} hasPendingEdit={hasPendingEdit} />
      )}
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
      onClick={async () => {
        await logoutAction();
        router.push("/login");
      }}
    >
      تسجيل الخروج
    </Button>
  );
}

function ProfessionalDashboard({
  professional,
  hasPendingEdit: initialHasPendingEdit,
}: {
  professional: Professional;
  hasPendingEdit: boolean;
}) {
  const { showToast } = useToast();
  const [description, setDescription] = useState(professional.description);
  const [phone, setPhone] = useState(professional.phone);
  const [hasPendingEdit, setHasPendingEdit] = useState(initialHasPendingEdit);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await submitProfileEditsAction({
      professionalId: professional.id,
      currentDescription: professional.description,
      currentPhone: professional.phone,
      newDescription: description,
      newPhone: phone,
    });
    setSaving(false);
    if (result?.error) {
      showToast(result.error);
      return;
    }
    setHasPendingEdit(true);
    showToast("تم إرسال التعديل للمراجعة");
  }

  return (
    <div>
      <h2 className="mb-2.5 text-sm font-bold text-text-primary">لوحتي كصاحب مهنة</h2>

      {hasPendingEdit && (
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
        {/* TODO(supabase): upload directly to the work-photos bucket + insert professional_documents (additive, no admin review needed). */}
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
