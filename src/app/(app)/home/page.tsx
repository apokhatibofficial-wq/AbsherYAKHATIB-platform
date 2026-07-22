import Link from "next/link";
import { ProfessionalRow } from "@/components/professionals/ProfessionalRow";
import { getApprovedProfessionals, getProfessions } from "@/lib/supabase/queries";

export default async function HomePage() {
  const [nearby, professions] = await Promise.all([getApprovedProfessionals(), getProfessions()]);

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
        <span className="text-sm text-text-faint">ابحث عن مهنة أو صاحب خدمة...</span>
      </Link>

      <h2 className="mb-3 text-sm font-bold text-text-primary">تصفح حسب المهنة</h2>
      <div className="mb-[26px] grid grid-cols-2 gap-2.5">
        {professions.map((profession) => (
          <Link
            key={profession}
            href={`/search?profession=${encodeURIComponent(profession)}`}
            className="flex items-center justify-center rounded-[14px] bg-success-bg px-2 py-3.5 text-center text-[13px] font-extrabold text-primary-dark"
          >
            {profession}
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
