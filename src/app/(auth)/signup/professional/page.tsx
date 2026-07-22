"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UploadTile } from "@/components/ui/UploadTile";
import { PROFESSIONS, CITIES } from "@/types/domain";
import { professionalSignupSchema, type ProfessionalSignupInput } from "@/lib/validation/auth";

type TextFields = Omit<ProfessionalSignupInput, "idFront" | "idBack" | "workPhotos">;

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<(File | null)[]>([null, null, null]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TextFields>({
    resolver: zodResolver(professionalSignupSchema.omit({ idFront: true, idBack: true, workPhotos: true })),
  });

  async function onSubmit(data: TextFields) {
    setFileError(null);
    const parsed = professionalSignupSchema.safeParse({
      ...data,
      idFront,
      idBack,
      workPhotos: workPhotos.filter((f): f is File => f !== null),
    });
    if (!parsed.success) {
      setFileError(parsed.error.issues.find((i) => i.path[0] === "idFront" || i.path[0] === "idBack")?.message ?? "يرجى إرفاق صور الهوية");
      return;
    }
    setSubmitting(true);
    // TODO: Supabase Auth signUp (role=professional) + upload files to Storage + insert professional_profiles (status=pending_review)
    router.push("/pending");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">تسجيل صاحب مهنة</h1>
      <p className="mb-5 text-[13px] leading-[1.6] text-text-muted">
        أنشئ ملفك المهني واعرض أعمالك بعد موافقة الإدارة
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="الاسم الكامل" placeholder="خالد المطيري" error={errors.fullName?.message} {...register("fullName")} />
        <Input label="البريد الإلكتروني" type="email" placeholder="name@example.com" ltr error={errors.email?.message} {...register("email")} />
        <Input label="كلمة المرور" type="password" placeholder="••••••••" ltr error={errors.password?.message} {...register("password")} />
        <Input label="رقم الهاتف" type="tel" placeholder="05xxxxxxxx" ltr error={errors.phone?.message} {...register("phone")} />

        <Select label="المهنة" error={errors.profession?.message} {...register("profession")}>
          <option value="">اختر المهنة</option>
          {PROFESSIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>

        <Select label="المدينة" error={errors.city?.message} {...register("city")}>
          <option value="">اختر المدينة</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <label className="mb-1.5 block text-[13px] font-semibold text-text-secondary">صور الهوية</label>
        <div className="mb-3.5 flex gap-2.5">
          <UploadTile name="idFront" label="الوجه الأمامي" onFileSelected={setIdFront} />
          <UploadTile name="idBack" label="الوجه الخلفي" onFileSelected={setIdBack} />
        </div>

        <label className="mb-1.5 block text-[13px] font-semibold text-text-secondary">صور الأعمال السابقة</label>
        <div className="mb-1.5 flex gap-2.5">
          {workPhotos.map((_, i) => (
            <UploadTile
              key={i}
              name={`workPhoto${i}`}
              onFileSelected={(file) =>
                setWorkPhotos((prev) => prev.map((f, idx) => (idx === i ? file : f)))
              }
            />
          ))}
        </div>
        {fileError && <p className="mb-4 text-xs font-medium text-danger">{fileError}</p>}
        {!fileError && <div className="mb-4" />}

        <Button type="submit" fullWidth disabled={submitting} className="mb-3.5">
          إرسال الطلب
        </Button>
      </form>

      <p className="text-center text-[13px] text-text-muted">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-bold text-primary">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
