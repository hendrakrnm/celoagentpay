"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3, MessageCircle, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/history", label: "History", icon: Clock3 },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/schedules", label: "Plans", icon: CalendarDays },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="z-40 flex h-20 w-full flex-shrink-0 items-center justify-around border-t-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 pb-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold uppercase transition-all duration-150 ${active ? "-translate-y-1 text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"}`}
          >
            <Icon className="h-[26px] w-[26px]" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth={2.5} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
