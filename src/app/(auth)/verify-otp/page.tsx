"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { verifyOtpAction, resendOtpAction } from "../actions";

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    const result = await verifyOtpAction(email, code);
    setSubmitting(false);
    if (result?.error) setError(result.error);
  }

  async function handleResend() {
    setResent(false);
    await resendOtpAction(email);
    setResent(true);
  }

  return (
    <div>
      <h1 className="mb-1 text-center text-xl font-extrabold text-text-primary">تفعيل الحساب</h1>
      <p className="mb-6 text-center text-[13px] leading-[1.7] text-text-muted">
        تم إرسال رمز التحقق إلى بريدك الإلكتروني، يرجى إدخاله لإكمال التسجيل
      </p>

      <OtpInput onComplete={setCode} />

      {error && <p className="mb-3 text-center text-xs font-medium text-danger">{error}</p>}

      <Button
        type="button"
        fullWidth
        disabled={code.length !== 6 || submitting}
        onClick={handleConfirm}
        className="mb-3.5"
      >
        تأكيد
      </Button>

      <p className="text-center text-[13px] text-text-muted">
        {resent ? (
          "تم إرسال رمز جديد"
        ) : (
          <>
            لم يصلك الرمز؟{" "}
            <button type="button" onClick={handleResend} className="font-bold text-primary cursor-pointer">
              إعادة الإرسال
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
