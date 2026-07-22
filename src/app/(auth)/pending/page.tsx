import { ClockIcon } from "@/components/ui/icons";
import { LinkButton } from "@/components/ui/LinkButton";

export default function PendingPage() {
  return (
    <div className="flex flex-col items-center pt-2 text-center">
      <div className="mb-[18px] flex h-16 w-16 items-center justify-center rounded-full bg-warning-bg">
        <ClockIcon size={30} className="text-gold" />
      </div>
      <h1 className="mb-2.5 text-[19px] font-extrabold text-text-primary">حسابك قيد الدراسة</h1>
      <p className="mb-6 text-sm leading-[1.8] text-text-muted">
        سيتم إشعارك بعد مراجعة بياناتك والموافقة عليها من قِبل إدارة المنصة.
      </p>
      <LinkButton href="/login" variant="outline" fullWidth>
        العودة لتسجيل الدخول
      </LinkButton>
    </div>
  );
}
