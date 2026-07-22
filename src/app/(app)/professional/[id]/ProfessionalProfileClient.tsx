"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { BackIcon, PinIcon, EyeIcon, PhoneIcon, HeartIcon, CameraIcon } from "@/components/ui/icons";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import type { Professional } from "@/types/domain";

export function ProfessionalProfileClient({ professional }: { professional: Professional }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(professional.id);

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border-light bg-white px-5 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#F0F2F0] cursor-pointer"
        >
          <BackIcon size={18} />
        </button>
        <h1 className="text-base font-bold text-text-primary">الملف الشخصي</h1>
      </div>

      <div className="px-5 py-6">
        <div className="mb-[18px] flex flex-col items-center text-center">
          <Avatar name={professional.name} id={professional.id} size={84} className="mb-3" />
          <div className="text-[19px] font-extrabold text-text-primary">{professional.name}</div>
          <div className="mt-2 rounded-full bg-success-bg px-3 py-1 text-[13px] font-bold text-primary">
            {professional.profession}
          </div>
        </div>

        <div className="mb-[18px] flex justify-around rounded-card border border-border-light bg-white py-3.5">
          <div className="text-center">
            <PinIcon size={16} className="mx-auto mb-1 text-text-muted" />
            <div className="text-[13px] font-bold text-text-primary">{professional.city}</div>
          </div>
          <div className="w-px bg-border-light" />
          <div className="text-center">
            <EyeIcon size={16} className="mx-auto mb-1 text-text-muted" />
            <div className="text-[13px] font-bold text-text-primary">{professional.viewCount} مشاهدة</div>
          </div>
        </div>

        <div className="mb-[22px] flex gap-2.5">
          <a
            href={`tel:${professional.phone}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-btn bg-primary py-3.5 text-sm font-bold text-white"
          >
            <PhoneIcon size={16} />
            اتصال {professional.phone}
          </a>
          <button
            type="button"
            onClick={() => toggleFavorite(professional.id)}
            className="flex w-12 items-center justify-center rounded-btn border-[1.5px] border-border bg-white cursor-pointer"
          >
            <HeartIcon size={20} filled={favorited} className="text-danger" />
          </button>
        </div>

        <h2 className="mb-2 text-sm font-bold text-text-primary">نبذة عن الخدمة</h2>
        <p className="mb-5 text-[13.5px] leading-[1.8] text-text-secondary">{professional.description}</p>

        <h2 className="mb-2.5 text-sm font-bold text-text-primary">معرض الأعمال</h2>
        {professional.galleryPhotoUrls.length === 0 ? (
          <p className="text-[13px] text-text-faint">لا توجد صور أعمال بعد</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {professional.galleryPhotoUrls.map((url, i) => (
              <div key={i} className="flex aspect-square items-center justify-center rounded-xl bg-[#F0F2F0]">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <CameraIcon size={24} className="text-[#B7BFBB]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
