import Link from "next/link";
import { SearchIcon } from "@/components/ui/icons";
import { ProfessionalRow } from "@/components/professionals/ProfessionalRow";
import { PROFESSIONS } from "@/types/domain";
import { MOCK_PROFESSIONALS } from "@/lib/mock/data";

export default async function HomePage() {
  // TODO(supabase): replace with a query scoped to the customer's nearby/recommended professionals.
  const nearby = MOCK_PROFESSIONALS;

  return (
    <div className="px-5 py-5">
      <h1 className="mb-0.5 text-[19px] font-extrabold text-text-primary">مرحبًا بك 👋</h1>
      <p className="mb-[18px] text-[13px] text-text-muted">
        ابحث عن أفضل أصحاب المهن الموثوقين بالقرب منك
      </p>

      <Link
        href="/search"
        className="mb-[22px] flex items-center gap-2.5 rounded-card border-[1.5px] border-border bg-white px-4 py-3.5"
      >
        <SearchIcon size={18} className="text-text-faint" />
        <span className="text-sm text-text-faint">ابحث عن مهنة أو صاحب خدمة...</span>
      </Link>

      <h2 className="mb-3 text-sm font-bold text-text-primary">تصفح حسب المهنة</h2>
      <div className="mb-[26px] grid grid-cols-4 gap-2.5">
        {PROFESSIONS.map((profession) => (
          <Link
            key={profession}
            href={`/search?profession=${encodeURIComponent(profession)}`}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-success-bg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B6B4A" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <span className="text-center text-[11px] font-semibold text-text-secondary">{profession}</span>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-bold text-text-primary">الأقرب إليك</h2>
      <div>
        {nearby.map((p) => (
          <ProfessionalRow key={p.id} professional={p} />
        ))}
      </div>
    </div>
  );
}
