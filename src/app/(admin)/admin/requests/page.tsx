"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { IdCardIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";
import { MOCK_ADMIN_REQUESTS } from "@/lib/mock/data";
import type { Professional } from "@/types/domain";

function DocThumb() {
  return (
    <div className="flex h-[52px] w-[74px] items-center justify-center rounded-lg border border-dashed border-upload-border bg-[#F0F2F0]">
      <IdCardIcon size={18} className="text-text-faint" />
    </div>
  );
}

export default function AdminRequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<Professional[]>(MOCK_ADMIN_REQUESTS);

  function handleDecision(id: string, decision: "approved" | "rejected") {
    // TODO(supabase): update professional_profiles.status and unlock the professional's account on approval.
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(decision === "approved" ? "تم قبول الطلب" : "تم رفض الطلب");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">طلبات تسجيل أصحاب المهن</h1>
      <p className="mb-5.5 text-[13px] text-text-muted">راجع مستندات كل طلب قبل اتخاذ القرار</p>

      {requests.length === 0 && (
        <div className="py-[60px] text-center text-sm text-text-muted">لا توجد طلبات معلّقة حاليًا</div>
      )}

      {requests.map((req) => (
        <div key={req.id} className="mb-4 rounded-card border border-border-light bg-white p-5.5">
          <div className="mb-3.5 flex items-start justify-between">
            <div>
              <div className="text-base font-bold text-text-primary">{req.name}</div>
              <div className="mt-0.5 text-[13px] text-text-muted">
                {req.profession} · {req.city} · {req.phone}
              </div>
            </div>
            <div className="rounded-lg bg-[#F0F2F0] px-2.5 py-1 text-xs text-text-faint">{req.submittedAt}</div>
          </div>

          <div className="mb-2 text-xs font-bold text-text-secondary">صور الهوية</div>
          <div className="mb-3.5 flex gap-2.5">
            <DocThumb />
            <DocThumb />
          </div>

          <div className="mb-2 text-xs font-bold text-text-secondary">صور الأعمال السابقة</div>
          <div className="mb-4.5 flex gap-2.5">
            <DocThumb />
            <DocThumb />
            <DocThumb />
          </div>

          <div className="flex gap-2.5">
            <Button type="button" variant="success" size="sm" className="flex-1" onClick={() => handleDecision(req.id, "approved")}>
              قبول الطلب
            </Button>
            <Button type="button" variant="dangerOutline" size="sm" className="flex-1" onClick={() => handleDecision(req.id, "rejected")}>
              رفض الطلب
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
