"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { MOCK_PENDING_EDITS } from "@/lib/mock/data";
import type { PendingEdit } from "@/types/domain";

export default function AdminEditsPage() {
  const { showToast } = useToast();
  const [edits, setEdits] = useState<PendingEdit[]>(MOCK_PENDING_EDITS.filter((e) => e.status === "pending"));

  function handleDecision(id: string, decision: "approved" | "rejected") {
    // TODO(supabase): on approve, copy new_value into the live professional_profiles column,
    // mark pending_edits resolved, and clear the professional's pending-edit banner.
    setEdits((prev) => prev.filter((e) => e.id !== id));
    showToast(decision === "approved" ? "تم اعتماد التعديل" : "تم رفض التعديل");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">تحديثات الملفات المعلّقة</h1>
      <p className="mb-5.5 text-[13px] text-text-muted">مراجعة التعديلات قبل نشرها للمستخدمين</p>

      {edits.length === 0 && (
        <div className="py-[60px] text-center text-sm text-text-muted">لا توجد تعديلات معلّقة حاليًا</div>
      )}

      {edits.map((edit) => (
        <div key={edit.id} className="mb-4 rounded-card border border-border-light bg-white p-5.5">
          <div className="mb-3.5 flex items-start justify-between">
            <div className="text-[15px] font-bold text-text-primary">
              {edit.professionalName}{" "}
              <span className="text-[13px] font-normal text-text-muted">· تعديل {edit.field}</span>
            </div>
            <div className="rounded-lg bg-[#F0F2F0] px-2.5 py-1 text-xs text-text-faint">{edit.submittedAt}</div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-[10px] bg-danger-bg p-3">
              <div className="mb-1 text-[11px] font-bold text-danger">القيمة الحالية</div>
              <div className="text-[13px] leading-[1.6] text-text-secondary">{edit.oldValue}</div>
            </div>
            <div className="rounded-[10px] bg-success-bg p-3">
              <div className="mb-1 text-[11px] font-bold text-success">القيمة الجديدة</div>
              <div className="text-[13px] leading-[1.6] text-text-secondary">{edit.newValue}</div>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Button type="button" variant="success" size="sm" className="flex-1" onClick={() => handleDecision(edit.id, "approved")}>
              اعتماد التعديل
            </Button>
            <Button type="button" variant="dangerOutline" size="sm" className="flex-1" onClick={() => handleDecision(edit.id, "rejected")}>
              رفض التعديل
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
