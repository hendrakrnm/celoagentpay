"use client";

import { useState } from "react";
import { Send, Split, RotateCw, Eye } from "lucide-react";

const chips = [
  { label: "Send payment", icon: Send },
  { label: "Split bill", icon: Split },
  { label: "Pay weekly", icon: RotateCw },
  { label: "Check balance", icon: Eye },
];

interface QuickChipsProps {
  onSelect: (chip: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="px-4 py-3 overflow-x-auto flex gap-2 scrollbar-hide">
      {chips.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => {
            setActive(label);
            onSelect(label);
            setTimeout(() => setActive(null), 300);
          }}
          className={`
            px-4 py-2.5 rounded-[20px]
            text-13 font-medium whitespace-nowrap
            border transition-all duration-150
            flex-shrink-0 flex items-center gap-2
            shadow-[var(--shadow-sm)]
            active:scale-95
            ${
              active === label
                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[var(--shadow-md)] scale-105"
                : "bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-[var(--shadow-md)]"
            }
          `}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
