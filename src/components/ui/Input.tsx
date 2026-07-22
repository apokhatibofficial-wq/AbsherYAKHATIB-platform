import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const fieldBase =
  "w-full rounded-input border-[1.5px] border-border bg-input-bg px-3.5 py-[13px] text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-primary transition-colors";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, error, id, children }: FieldWrapperProps) {
  return (
    <div className="mb-3.5">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-text-secondary">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  ltr?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ltr, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} id={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          className={cn(fieldBase, ltr && "text-right", className)}
          style={ltr ? { direction: "ltr" } : undefined}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} id={fieldId}>
        <textarea ref={ref} id={fieldId} className={cn(fieldBase, "resize-none", className)} {...props} />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, id, children, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldWrapper label={label} error={error} id={fieldId}>
        <select ref={ref} id={fieldId} className={cn(fieldBase, "bg-white", className)} {...props}>
          {children}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = "Select";
