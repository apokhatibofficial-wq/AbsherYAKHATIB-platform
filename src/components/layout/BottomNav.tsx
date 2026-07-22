"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { HomeIcon, SearchIcon, StarIcon, UserIcon } from "@/components/ui/icons";

const TABS = [
  { href: "/home", label: "الرئيسية", Icon: HomeIcon },
  { href: "/search", label: "البحث", Icon: SearchIcon },
  { href: "/featured", label: "المميزون", Icon: StarIcon },
  { href: "/account", label: "حسابي", Icon: UserIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex border-t border-border-light bg-white px-3 pt-2"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-[3px] px-0 py-1.5"
          >
            <Icon size={21} className={cn(active ? "text-primary" : "text-text-faint")} />
            <span
              className={cn(
                "text-[10.5px] font-bold",
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
