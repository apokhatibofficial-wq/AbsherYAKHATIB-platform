"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { approveEditAction, rejectEditAction } from "../actions";
import type { PendingEdit } from "@/types/domain";

const FIELD_LABELS: Record<string, string> = {
  description: "الوصف",
  phone: "رقم التواصل",
};

export function EditsClient({ initialEdits }: { initialEdits: PendingEdit[] }) {
  const { showToast } = useToast();
  const [edits, setEdits] = useState<PendingEdit[]>(initialEdits);
  const [pending, setPending] = useState<string | null>(null);

  async function handleDecision(id: string, decision: "approved" | "rejected") {
    setPending(id);
    const result = decision === "approved" ? await approveEditAction(id) : await rejectEditAction(id);
    setPending(null);
    if (result?.error) {
      showToast(result.error);
      return;
    }
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
              <span className="text-[13px] font-normal text-text-muted">
                · تعديل {FIELD_LABELS[edit.field] ?? edit.field}
              </span>
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
            <Button
              type="button"
              variant="success"
              size="sm"
              className="flex-1"
              disabled={pending === edit.id}
              onClick={() => handleDecision(edit.id, "approved")}
            >
              اعتماد التعديل
            </Button>
            <Button
              type="button"
              variant="dangerOutline"
              size="sm"
              className="flex-1"
              disabled={pending === edit.id}
              onClick={() => handleDecision(edit.id, "rejected")}
            >
              رفض التعديل
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
