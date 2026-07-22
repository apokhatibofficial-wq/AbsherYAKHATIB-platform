"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { BackIcon, PinIcon, EyeIcon, PhoneIcon, StarIcon, CameraIcon } from "@/components/ui/icons";
import { ProfessionIcon } from "@/components/ui/professionIcons";
import { StarRating } from "@/components/ui/StarRating";
import { useToast } from "@/components/ui/Toast";
import type { Professional } from "@/types/domain";
import { rateProfessionalAction } from "./actions";

export function ProfessionalProfileClient({
  professional,
  myRating,
}: {
  professional: Professional;
  myRating: number | null;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [rating, setRating] = useState(myRating);

  async function handleRate(stars: number) {
    setRating(stars);
    const result = await rateProfessionalAction(professional.id, stars);
    if (result?.error) {
      showToast(result.error);
      return;
    }
    showToast("شكرًا على تقييمك");
  }

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
          <Avatar name={professional.name} id={professional.id} gender={professional.gender} size={84} className="mb-3" />
          <div className="text-[19px] font-extrabold text-text-primary">{professional.name}</div>
          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-[13px] font-bold text-[#006B47]">
            <ProfessionIcon profession={professional.profession} size={15} />
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
          <div className="w-px bg-border-light" />
          <div className="text-center">
            <StarIcon size={16} filled className="mx-auto mb-1 text-gold" />
            <div className="text-[13px] font-bold text-text-primary">
              {professional.avgRating !== null ? `${professional.avgRating} (${professional.ratingCount})` : "لا يوجد"}
            </div>
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
          {professional.locationUrl && (
            <a
              href={professional.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-12 items-center justify-center rounded-btn border-[1.5px] border-border bg-white cursor-pointer"
            >
              <PinIcon size={20} className="text-primary" />
            </a>
          )}
        </div>

        <div className="mb-5 rounded-card border border-border-light bg-white p-4 text-center">
          <div className="mb-2 text-sm font-bold text-text-primary">قيّم هذا الشخص</div>
          <div className="flex justify-center">
            <StarRating value={rating} onRate={handleRate} />
          </div>
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
