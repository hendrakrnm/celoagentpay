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
    <nav className="bottom-nav">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
            <Icon className="nav-icon" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
