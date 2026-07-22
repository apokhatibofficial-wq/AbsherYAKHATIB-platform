"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/home", label: "الرئيسية" },
  { href: "/search", label: "البحث" },
  { href: "/ads", label: "الإعلانات" },
  { href: "/featured", label: "المميزون" },
  { href: "/account", label: "حسابي" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex border-t border-border-light bg-white px-2 pt-2"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
    >
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 items-center justify-center px-0 py-2.5"
          >
            <span
              className={cn(
                "whitespace-nowrap text-[11.5px] font-extrabold",
                active ? "text-primary" : "text-text-faint"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
