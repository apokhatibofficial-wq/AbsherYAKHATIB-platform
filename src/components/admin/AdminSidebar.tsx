"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface AdminSidebarProps {
  requestsCount: number;
  editsCount: number;
}

const NAV = [
  { href: "/admin/requests", label: "طلبات التسجيل", countKey: "requestsCount" as const },
  { href: "/admin/edits", label: "تعديلات الملفات", countKey: "editsCount" as const },
  { href: "/admin/users", label: "المستخدمون", countKey: null },
];

export function AdminSidebar({ requestsCount, editsCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const counts = { requestsCount, editsCount };

  return (
    <aside className="flex w-[230px] flex-none flex-col bg-primary-dark px-4.5 py-6.5 text-white">
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <Image
          src="/absher-logo.png"
          alt="أبشر"
          width={34}
          height={34}
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <span className="text-[17px] font-extrabold">لوحة الإدارة</span>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const count = item.countKey ? counts[item.countKey] : null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[10px] px-3.5 py-3 text-right text-sm text-white",
                active ? "bg-white/15 font-bold" : "font-medium hover:bg-white/5"
              )}
            >
              {item.label}
              {count !== null && <span className="mr-1.5 text-xs opacity-70">({count})</span>}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <Link
        href="/account"
        className="rounded-[10px] border border-white/30 px-3.5 py-2.5 text-center text-[13px] font-semibold text-white"
      >
        رجوع للتطبيق ←
      </Link>
    </aside>
  );
}
