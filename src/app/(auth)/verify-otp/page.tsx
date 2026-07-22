"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EnvelopeIcon } from "@/components/ui/icons";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  async function handleConfirm() {
    // TODO: Supabase Auth verifyOtp() with the entered code.
    router.push("/home");
  }

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-bg">
          <EnvelopeIcon size={26} className="text-primary" />
        </div>
      </div>
      <h1 className="mb-1 text-center text-xl font-extrabold text-text-primary">تفعيل الحساب</h1>
      <p className="mb-6 text-center text-[13px] leading-[1.7] text-text-muted">
        تم إرسال رمز التحقق إلى بريدك الإلكتروني، يرجى إدخاله لإكمال التسجيل
      </p>

      <OtpInput onComplete={setCode} />

      <Button type="button" fullWidth disabled={code.length !== 6} onClick={handleConfirm} className="mb-3.5">
        تأكيد
      </Button>

      <p className="text-center text-[13px] text-text-muted">
        لم يصلك الرمز؟ <button type="button" className="font-bold text-primary cursor-pointer">إعادة الإرسال</button>
      </p>
    </div>
  );
}
