import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-btn font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-dark",
        outline: "bg-white text-primary border-[1.5px] border-primary hover:bg-success-bg",
        success: "bg-success text-white hover:brightness-95",
        dangerOutline: "bg-white text-danger border-[1.5px] border-danger hover:bg-danger-bg",
        dark: "bg-primary-dark text-white hover:brightness-110",
        ghostIcon: "bg-[#F0F2F0] text-text-primary hover:bg-border-light",
        subtleOutline: "bg-white text-text-secondary border border-border hover:bg-app-bg",
      },
      size: {
        md: "px-4 py-[13px] text-[15px]",
        sm: "px-3 py-[11px] text-[13px]",
        icon: "w-[34px] h-[34px] p-0 rounded-[10px]",
        iconLg: "w-12 h-12 p-0 rounded-btn",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
