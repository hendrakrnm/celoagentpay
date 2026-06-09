"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, History, Users, RotateCw } from "lucide-react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/history", label: "History", icon: History },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/schedules", label: "Schedules", icon: RotateCw },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        bg-[var(--color-surface)] backdrop-blur-[12px]
        border-t border-[var(--color-border)]
        flex items-center justify-around
        h-16 px-4
        safe-area-inset-bottom
      "
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`
              flex flex-col items-center gap-1 px-4 py-2
              rounded-lg transition-colors duration-150
              min-h-[44px] min-w-[44px] flex items-center justify-center
              ${
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              }
            `}
          >
            <Icon className="w-6 h-6" />
            <span className="text-10 font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
