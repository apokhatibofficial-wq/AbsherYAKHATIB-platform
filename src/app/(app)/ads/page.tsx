import Image from "next/image";
import { getAds } from "@/lib/supabase/queries";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/ads";

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div className="px-5 py-5">
      <h1 className="mb-1 text-[19px] font-extrabold text-text-primary">الإعلانات</h1>
      <p className="mb-4 text-[13px] text-text-muted">إعلانات مختارة من إدارة المنصة</p>

      {ads.length === 0 ? (
        <div className="py-[70px] text-center text-sm text-text-muted">لا توجد إعلانات حاليًا</div>
      ) : (
        ads.map((ad) => (
          <div key={ad.id} className="mb-4 overflow-hidden rounded-card border border-border-light bg-white">
            {ad.imageUrls.length > 0 && (
              <div className="flex gap-1 overflow-x-auto">
                {ad.imageUrls.map((url, i) => (
                  <div key={i} className="relative h-40 w-full flex-none">
                    <Image
                      src={url}
                      alt={ad.name ?? "إعلان"}
                      fill
                      sizes="(max-width: 512px) 100vw, 512px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="p-4">
              {ad.name && <div className="mb-2 text-[15px] font-extrabold text-text-primary">{ad.name}</div>}

              <div className="flex flex-wrap gap-2">
                {ad.phone && (
                  <a href={`tel:${ad.phone}`} className="rounded-btn bg-primary px-3.5 py-2 text-[13px] font-bold text-white">
                    اتصال
                  </a>
                )}
                {ad.externalUrl && (
                  <a
                    href={ad.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-btn border-[1.5px] border-primary px-3.5 py-2 text-[13px] font-bold text-primary"
                  >
                    التفاصيل
                  </a>
                )}
                {ad.locationUrl && (
                  <a
                    href={ad.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-btn border-[1.5px] border-border px-3.5 py-2 text-[13px] font-bold text-text-secondary"
                  >
                    الموقع
                  </a>
                )}
                {Object.entries(ad.socialLinks).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-btn border-[1.5px] border-border px-3.5 py-2 text-[13px] font-bold text-text-secondary"
                  >
                    {SOCIAL_PLATFORM_LABELS[key] ?? key}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
