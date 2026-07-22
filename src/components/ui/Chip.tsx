import { cn } from "@/lib/utils/cn";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-none whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-bold transition-colors cursor-pointer",
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-white text-text-secondary hover:border-primary/40",
        className
      )}
    >
      {label}
    </button>
  );
}

interface StatusPillProps {
  tone: "success" | "danger" | "warning" | "neutral";
  children: React.ReactNode;
}

const TONE_CLASSES: Record<StatusPillProps["tone"], string> = {
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning-text",
  neutral: "bg-[#F0F2F0] text-text-muted",
};

export function StatusPill({ tone, children }: StatusPillProps) {
  return (
    <span className={cn("rounded-full px-2.5 py-[3px] text-[11.5px] font-bold", TONE_CLASSES[tone])}>
      {children}
    </span>
  );
}
