"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase Auth signUp() -> sends OTP/confirmation email, blocks login until verified.
    router.push("/verify-otp");
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">إنشاء حساب جديد</h1>
      <p className="mb-6 text-[13px] text-text-muted">ابحث عن أفضل أصحاب المهن بالقرب منك</p>

      <form onSubmit={handleSubmit}>
        <Input label="الاسم الكامل" name="fullName" type="text" placeholder="محمد عبدالله" required />
        <Input label="البريد الإلكتروني" name="email" type="email" placeholder="name@example.com" ltr required />
        <Input label="كلمة المرور" name="password" type="password" placeholder="••••••••" ltr required minLength={8} />

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
