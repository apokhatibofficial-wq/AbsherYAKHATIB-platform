"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { addFeaturedAction, removeFeaturedAction } from "../actions";
import type { FeaturedCandidate } from "@/lib/supabase/queries";

export function FeaturedClient({ initialCandidates }: { initialCandidates: FeaturedCandidate[] }) {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [pending, setPending] = useState<string | null>(null);

  async function toggle(candidate: FeaturedCandidate) {
    setPending(candidate.id);
    const result = candidate.featured
      ? await removeFeaturedAction(candidate.id)
      : await addFeaturedAction(candidate.id);
    setPending(null);
    if (result?.error) {
      showToast(result.error);
      return;
    }
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, featured: !c.featured } : c))
    );
    showToast(candidate.featured ? "تمت الإزالة من قائمة المميزين" : "تمت الإضافة لقائمة المميزين");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">إدارة قائمة المميزين</h1>
      <p className="mb-5.5 text-[13px] text-text-muted">
        أضف أو أزل أصحاب المهن المعتمدين من قائمة &quot;المميزون&quot; التي تظهر للعملاء
      </p>

      {candidates.length === 0 && (
        <div className="py-[60px] text-center text-sm text-text-muted">لا يوجد أصحاب مهن معتمدون بعد</div>
      )}

      <div className="overflow-hidden rounded-card border border-border-light bg-white">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border-b border-border-light px-5 py-3.5 last:border-b-0"
          >
            <div>
              <div className="text-[14px] font-bold text-text-primary">{c.name}</div>
              <div className="text-[12.5px] text-text-muted">
                {c.profession} · {c.city}
              </div>
            </div>
            <Button
              type="button"
              variant={c.featured ? "dangerOutline" : "success"}
              size="sm"
              disabled={pending === c.id}
              onClick={() => toggle(c)}
            >
              {c.featured ? "إزالة" : "إضافة"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
