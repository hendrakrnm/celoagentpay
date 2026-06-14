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
    <nav className="z-40 flex h-20 flex-shrink-0 items-center justify-around border-t-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 pb-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase transition-transform duration-150 ${
              isActive ? "-translate-y-1 text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"
            }`}
          >
            <Icon className="h-6 w-6" fill={isActive ? "currentColor" : "none"} strokeWidth={2.5} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
