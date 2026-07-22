import Link, { type LinkProps } from "next/link";
import { buttonVariants, type ButtonProps } from "./Button";
import { cn } from "@/lib/utils/cn";

interface LinkButtonProps extends LinkProps, Pick<ButtonProps, "variant" | "size" | "fullWidth"> {
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ variant, size, fullWidth, className, children, ...linkProps }: LinkButtonProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)} {...linkProps}>
      {children}
    </Link>
  );
}
