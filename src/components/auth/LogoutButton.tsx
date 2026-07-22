"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { logoutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils/cn";

export function LogoutButton({ className, variant = "subtleOutline", ...props }: Partial<ButtonProps>) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant={variant}
      fullWidth
      className={cn("!text-danger", className)}
      onClick={async () => {
        await logoutAction();
        router.push("/login");
      }}
      {...props}
    >
      تسجيل الخروج
    </Button>
  );
}
