import { cn } from "@/lib/utils/cn";

interface GenderPickerProps {
  name: string;
  value: string;
  onChange: (value: "male" | "female") => void;
  error?: string;
}

export function GenderPicker({ name, value, onChange, error }: GenderPickerProps) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-[13px] font-semibold text-text-secondary">الجنس</label>
      <div className="flex gap-2.5">
        {(
          [
            { key: "male", label: "ذكر" },
            { key: "female", label: "أنثى" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              "flex-1 rounded-input border-[1.5px] py-3 text-sm font-semibold cursor-pointer transition-colors",
              value === opt.key
                ? "border-primary bg-success-bg text-primary"
                : "border-border bg-input-bg text-text-secondary"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
