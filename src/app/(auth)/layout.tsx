import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-backdrop px-4 py-8 sm:px-6">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_rgba(6,61,43,0.1)] sm:border sm:border-border-light">
        <div className="flex flex-col items-center pt-9 pb-2">
          <Image src="/absher-logo.png" alt="أبشر" width={74} height={74} priority className="mb-2 h-auto w-[74px]" />
          <p className="text-[13px] font-medium text-text-muted">منصة الخدمات المهنية الموثوقة</p>
        </div>
        <div className="px-6 pb-8 pt-5 sm:px-7">{children}</div>
      </div>
    </div>
  );
}
