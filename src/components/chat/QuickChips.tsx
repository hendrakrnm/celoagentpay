"use client";

import { useState } from "react";
import { Send, Split, RotateCw, Eye } from "lucide-react";

const chips = [
  { label: "Send payment", display: "Send", icon: Send },
  { label: "Receive", display: "Receive", icon: Split },
  { label: "Swap", display: "Swap", icon: RotateCw },
  { label: "Check balance", display: "Balance", icon: Eye },
];

const colors = [
  "bg-[var(--color-primary)] text-[var(--color-surface)]",
  "bg-[var(--color-secondary)] text-[var(--color-surface)]",
  "bg-[var(--color-accent)] text-[var(--border-color)]",
  "bg-[var(--color-surface)] text-[var(--border-color)]",
];

interface QuickChipsProps {
  onSelect: (chip: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto border-t-[3px] border-[var(--border-color)] bg-[var(--color-bg)] px-4 py-3">
      {chips.map(({ label, display, icon: Icon }, index) => {
        const colorClass = colors[index % colors.length];
        return (
          <button
            key={label}
            onClick={() => {
              setActive(label);
              onSelect(label);
              setTimeout(() => setActive(null), 300);
            }}
            className={`memphis-press flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] px-4 py-2 text-sm font-semibold shadow-[var(--shadow-offset)] ${colorClass} ${
              active === label ? "translate-x-1 translate-y-1 shadow-[var(--shadow-active)]" : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{display}</span>
          </button>
        );
      })}
    </div>
  );
}
