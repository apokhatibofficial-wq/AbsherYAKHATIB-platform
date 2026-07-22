"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UploadTile } from "@/components/ui/UploadTile";
import { GenderPicker } from "@/components/ui/GenderPicker";
import { CITIES } from "@/types/domain";
import { professionalSignupSchema, type ProfessionalSignupInput } from "@/lib/validation/auth";
import {
  professionalSignupAction,
  getProfessionalDocUploadUrlAction,
  attachProfessionalDocumentAction,
  finishProfessionalSignupAction,
} from "../../actions";
import { uploadViaSignedUrl, fileExt } from "@/lib/uploadFile";

type TextFields = Omit<ProfessionalSignupInput, "idFront" | "idBack" | "workPhotos">;

const OTHER_PROFESSION = "__other__";

export function ProfessionalSignupForm({ professions }: { professions: string[] }) {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<(File | null)[]>([null, null, null]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isCustomProfession, setIsCustomProfession] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "">("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TextFields>({
    resolver: zodResolver(professionalSignupSchema.omit({ idFront: true, idBack: true, workPhotos: true })),
  });

  function handleGenderChange(next: "male" | "female") {
    setGender(next);
    setValue("gender", next, { shouldValidate: true });
  }

  function handleProfessionSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === OTHER_PROFESSION) {
      setIsCustomProfession(true);
      setValue("profession", "");
    } else {
      setIsCustomProfession(false);
      setValue("profession", e.target.value, { shouldValidate: true });
    }
  }

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

    const formData = new FormData();
    formData.set("fullName", parsed.data.fullName);
    formData.set("email", parsed.data.email);
    formData.set("password", parsed.data.password);
    formData.set("phone", parsed.data.phone);
    formData.set("gender", parsed.data.gender);
    formData.set("profession", parsed.data.profession);
    formData.set("city", parsed.data.city);
    if (parsed.data.locationUrl) formData.set("locationUrl", parsed.data.locationUrl);

    const result = await professionalSignupAction(formData);
    if (result?.error || !result.userId) {
      setSubmitting(false);
      setFileError(result?.error ?? "فشل إنشاء الحساب");
      return;
    }
    const userId = result.userId;

    const docs: { kind: "id_front" | "id_back" | "work_photo"; file: File }[] = [
      { kind: "id_front", file: parsed.data.idFront },
      { kind: "id_back", file: parsed.data.idBack },
      ...(parsed.data.workPhotos ?? []).map((file) => ({ kind: "work_photo" as const, file })),
    ];

    for (const doc of docs) {
      const uploadUrl = await getProfessionalDocUploadUrlAction(userId, doc.kind, fileExt(doc.file));
      if (uploadUrl.error || !uploadUrl.path || !uploadUrl.token || !uploadUrl.bucket) continue;
      const uploadError = await uploadViaSignedUrl(uploadUrl.bucket, uploadUrl.path, uploadUrl.token, doc.file);
      if (!uploadError) await attachProfessionalDocumentAction(userId, doc.kind, uploadUrl.path);
    }

    await finishProfessionalSignupAction();
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
        <Input label="رقم الهاتف" type="tel" placeholder="09xxxxxxxx" ltr error={errors.phone?.message} {...register("phone")} />
        <GenderPicker name="gender" value={gender} onChange={handleGenderChange} error={errors.gender?.message} />

        <Select label="المهنة" onChange={handleProfessionSelect} defaultValue="">
          <option value="" disabled>اختر المهنة</option>
          {professions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
          <option value={OTHER_PROFESSION}>أخرى (اكتبها)</option>
        </Select>
        {isCustomProfession && (
          <Input
            label="اسم المهنة"
            placeholder="اكتب مهنتك"
            error={errors.profession?.message}
            {...register("profession")}
          />
        )}
        {!isCustomProfession && errors.profession?.message && (
          <p className="-mt-2 mb-3.5 text-xs font-medium text-danger">{errors.profession.message}</p>
        )}

        <Select label="المدينة" error={errors.city?.message} {...register("city")}>
          <option value="">اختر المدينة</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>

        <Input
          label="رابط الموقع على خرائط جوجل (اختياري)"
          placeholder="https://maps.google.com/..."
          ltr
          error={errors.locationUrl?.message}
          {...register("locationUrl")}
        />

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
