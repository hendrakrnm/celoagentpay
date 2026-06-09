"use client";

import { useState } from "react";

const chips = [
  "Send payment",
  "Split bill",
  "Pay weekly",
  "Check balance",
];

interface QuickChipsProps {
  onSelect: (chip: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div
      className="
        px-4 py-3 overflow-x-auto
        flex gap-2
        scrollbar-hide
      "
    >
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => {
            setActive(chip);
            onSelect(chip);
            setTimeout(() => setActive(null), 300);
          }}
          className={`
            px-3 py-2 rounded-[999px]
            text-13 font-medium whitespace-nowrap
            border transition-all duration-150
            flex-shrink-0
            ${
              active === chip
                ? "bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary-dark)]"
                : "bg-[var(--color-surface-raised)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }
          `}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
