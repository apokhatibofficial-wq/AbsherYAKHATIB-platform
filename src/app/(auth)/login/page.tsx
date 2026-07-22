"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginAction } from "../actions";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(String(formData.get("email")), String(formData.get("password")));
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-extrabold text-text-primary">تسجيل الدخول</h1>
      <p className="mb-6 text-[13px] text-text-muted">مرحبًا بعودتك، يرجى إدخال بياناتك</p>

      <form onSubmit={handleSubmit}>
        <Input label="البريد الإلكتروني" name="email" type="email" placeholder="name@example.com" ltr required />
        <Input label="كلمة المرور" name="password" type="password" placeholder="••••••••" ltr required />

        {error && <p className="mb-3 text-xs font-medium text-danger">{error}</p>}

        <Button type="submit" fullWidth disabled={loading} className="mt-2 mb-4">
          تسجيل الدخول
        </Button>
      </form>

      <p className="mb-5 text-center text-[13px] text-text-muted">
        ليس لديك حساب؟{" "}
        <Link href="/signup" className="font-bold text-primary">
          إنشاء حساب
        </Link>
      </p>

      <div className="mb-5 h-px bg-border" />

      <Button type="button" variant="outline" fullWidth onClick={() => router.push("/signup/professional")}>
        تسجيل الدخول كصاحب مهنة
      </Button>
    </div>
  );
}
