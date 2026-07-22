"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { setUserStatusAction } from "../actions";
import type { AdminUser, UserRole } from "@/types/domain";

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "عميل",
  professional: "صاحب مهنة",
  admin: "مدير",
};

export function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [pending, setPending] = useState<string | null>(null);

  async function toggleStatus(user: AdminUser) {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    setPending(user.id);
    const result = await setUserStatusAction(user.id, nextStatus);
    setPending(null);
    if (result?.error) {
      showToast(result.error);
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    showToast(nextStatus === "suspended" ? "تم إيقاف الحساب" : "تم تفعيل الحساب");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">إدارة المستخدمين</h1>
      <p className="mb-5.5 text-[13px] text-text-muted">جميع الحسابات المسجلة في المنصة</p>

      <div className="overflow-hidden rounded-card border border-border-light bg-white">
        <div className="grid grid-cols-[2fr_1.2fr_2fr_1fr_1fr] bg-[#F0F2F0] px-5 py-3 text-xs font-bold text-text-secondary">
          <div>الاسم</div>
          <div>الدور</div>
          <div>البريد الإلكتروني</div>
          <div>الحالة</div>
          <div />
        </div>

        {users.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[2fr_1.2fr_2fr_1fr_1fr] items-center border-t border-border-light px-5 py-3.5 text-[13.5px] text-text-primary"
          >
            <div className="font-semibold">{u.name}</div>
            <div className="text-text-muted">{ROLE_LABELS[u.role]}</div>
            <div className="text-right text-text-muted" style={{ direction: "ltr" }}>{u.email}</div>
            <div>
              <span
                className={
                  u.status === "active"
                    ? "rounded-full bg-success-bg px-2.5 py-[3px] text-[11.5px] font-bold text-success"
                    : "rounded-full bg-danger-bg px-2.5 py-[3px] text-[11.5px] font-bold text-danger"
                }
              >
                {u.status === "active" ? "نشط" : "موقوف"}
              </span>
            </div>
            <div>
              <button
                type="button"
                disabled={pending === u.id}
                onClick={() => toggleStatus(u)}
                className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-text-secondary cursor-pointer disabled:opacity-50"
              >
                {u.status === "active" ? "إيقاف" : "تفعيل"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
