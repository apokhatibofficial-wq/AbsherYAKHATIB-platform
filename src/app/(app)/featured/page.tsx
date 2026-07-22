import { ProfessionalRow } from "@/components/professionals/ProfessionalRow";
import { getFeaturedProfessionals } from "@/lib/supabase/queries";

export default async function FeaturedPage() {
  const featured = await getFeaturedProfessionals();

  return (
    <div className="px-5 py-5">
      <h1 className="mb-1 text-[19px] font-extrabold text-text-primary">المميزون</h1>
      <p className="mb-4 text-[13px] text-text-muted">أعلى أصحاب المهن تقييمًا، باختيار إدارة المنصة</p>

      {featured.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-[70px] text-center">
          <p className="text-sm text-text-muted">لا يوجد أصحاب مهن مميّزون حاليًا</p>
        </div>
      ) : (
        featured.map((p) => <ProfessionalRow key={p.id} professional={p} />)
      )}
    </div>
  );
}
