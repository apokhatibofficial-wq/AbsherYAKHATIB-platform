"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GenderPicker } from "@/components/ui/GenderPicker";
import { customerSignupAction } from "../actions";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<"male" | "female" | "">("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!gender) {
      setError("اختر الجنس");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await customerSignupAction({
      fullName: String(formData.get("fullName")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      gender,
    });
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">إنشاء حساب جديد</h1>
      <p className="mb-6 text-[13px] text-text-muted">ابحث عن أفضل أصحاب المهن بالقرب منك</p>

      <form onSubmit={handleSubmit}>
        <Input label="الاسم الكامل" name="fullName" type="text" placeholder="محمد عبدالله" required />
        <Input label="البريد الإلكتروني" name="email" type="email" placeholder="name@example.com" ltr required />
        <Input label="كلمة المرور" name="password" type="password" placeholder="••••••••" ltr required minLength={8} />
        <GenderPicker name="gender" value={gender} onChange={setGender} />

        {error && <p className="mb-3 text-xs font-medium text-danger">{error}</p>}

        <Button type="submit" fullWidth disabled={loading} className="mt-2 mb-3.5">
          إنشاء الحساب
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
