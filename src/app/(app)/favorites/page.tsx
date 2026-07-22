import { redirect } from "next/navigation";
import { HeartIcon } from "@/components/ui/icons";
import { ProfessionalRow } from "@/components/professionals/ProfessionalRow";
import { getCurrentUser } from "@/lib/auth/session";
import { getFavoriteProfessionals } from "@/lib/supabase/queries";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const favorites = await getFavoriteProfessionals(user.id);

  return (
    <div className="px-5 py-5">
      <h1 className="mb-4 text-[19px] font-extrabold text-text-primary">المفضلة</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-[70px] text-center">
          <HeartIcon size={46} className="mb-3.5 text-upload-border" />
          <p className="text-sm text-text-muted">لا توجد عناصر في المفضلة بعد</p>
        </div>
      ) : (
        favorites.map((p) => <ProfessionalRow key={p.id} professional={p} />)
      )}
    </div>
  );
}
