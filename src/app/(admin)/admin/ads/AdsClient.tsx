"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UploadTile } from "@/components/ui/UploadTile";
import { useToast } from "@/components/ui/Toast";
import { createAdAction, deleteAdAction } from "../actions";
import { SOCIAL_PLATFORMS } from "@/lib/ads";
import type { Ad } from "@/types/domain";

const IMAGE_SLOTS = 3;

export function AdsClient({ initialAds }: { initialAds: Ad[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [images, setImages] = useState<(File | null)[]>(Array(IMAGE_SLOTS).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    images.forEach((file) => {
      if (file) formData.append("images", file);
    });
    const result = await createAdAction(formData);
    setSubmitting(false);
    if (result?.error) {
      showToast(result.error);
      return;
    }
    setImages(Array(IMAGE_SLOTS).fill(null));
    setFormKey((k) => k + 1);
    showToast("تمت إضافة الإعلان");
    router.refresh();
  }

  async function handleDelete(adId: string) {
    setDeleting(adId);
    const result = await deleteAdAction(adId);
    setDeleting(null);
    if (result?.error) {
      showToast(result.error);
      return;
    }
    showToast("تم حذف الإعلان");
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">إدارة الإعلانات</h1>
      <p className="mb-5.5 text-[13px] text-text-muted">
        تظهر الإعلانات للعملاء في تبويب &quot;الإعلانات&quot;. كل الحقول اختيارية.
      </p>

      <form key={formKey} action={handleSubmit} className="mb-8 rounded-card border border-border-light bg-white p-5">
        <Input label="اسم المعلن (اختياري)" name="name" placeholder="اسم النشاط أو المعلن" />
        <Input label="الرابط الخارجي (اختياري)" name="externalUrl" placeholder="https://..." ltr />
        <Input label="رقم الهاتف (اختياري)" name="phone" placeholder="09xxxxxxxx" ltr />
        <Input label="رابط الموقع على خرائط جوجل (اختياري)" name="locationUrl" placeholder="https://maps.google.com/..." ltr />

        <label className="mb-1.5 block text-[13px] font-semibold text-text-secondary">وسائل التواصل الاجتماعي (اختياري)</label>
        <div className="mb-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {SOCIAL_PLATFORMS.map((p) => (
            <Input key={p.key} name={`social_${p.key}`} placeholder={p.label} ltr />
          ))}
        </div>

        <label className="mb-1.5 block text-[13px] font-semibold text-text-secondary">صور الإعلان (اختياري)</label>
        <div className="mb-4 flex gap-2.5">
          {images.map((_, i) => (
            <UploadTile
              key={i}
              name={`imageSlot${i}`}
              onFileSelected={(file) => setImages((prev) => prev.map((f, idx) => (idx === i ? file : f)))}
            />
          ))}
        </div>

        <Button type="submit" disabled={submitting}>
          إضافة الإعلان
        </Button>
      </form>

      <h2 className="mb-3 text-sm font-bold text-text-primary">الإعلانات الحالية</h2>
      {initialAds.length === 0 ? (
        <div className="py-[40px] text-center text-sm text-text-muted">لا توجد إعلانات بعد</div>
      ) : (
        <div className="overflow-hidden rounded-card border border-border-light bg-white">
          {initialAds.map((ad) => (
            <div key={ad.id} className="flex items-center justify-between gap-3 border-b border-border-light px-5 py-3.5 last:border-b-0">
              <div className="flex items-center gap-3">
                {ad.imageUrls[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ad.imageUrls[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                )}
                <div>
                  <div className="text-[14px] font-bold text-text-primary">{ad.name || "بدون اسم"}</div>
                  <div className="text-[12.5px] text-text-muted">
                    {[ad.phone, ad.externalUrl].filter(Boolean).join(" · ") || "لا تفاصيل إضافية"}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="dangerOutline"
                size="sm"
                disabled={deleting === ad.id}
                onClick={() => handleDelete(ad.id)}
              >
                حذف
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
