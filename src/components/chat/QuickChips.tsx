"use client";

const chips = [
  { label: "Send payment", display: "Send", color: "bg-[var(--color-primary)] text-[var(--color-surface)]" },
  { label: "Receive", display: "Receive", color: "bg-[var(--color-secondary)] text-[var(--color-surface)]" },
  { label: "Swap", display: "Swap", color: "bg-[var(--color-accent)] text-[var(--border-color)]" },
  { label: "Check balance", display: "History", color: "bg-[var(--color-surface)] text-[var(--border-color)]" },
];

interface QuickChipsProps {
  onSelect: (chip: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  return (
    <div className="flex flex-shrink-0 gap-3 overflow-x-auto bg-[var(--color-bg)] px-4 pb-4 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onSelect(chip.label)}
          className={`whitespace-nowrap rounded-[12px] border-[3px] border-[var(--border-color)] px-[18px] py-2 text-sm font-semibold shadow-[var(--shadow-offset)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${chip.color}`}
        >
          {chip.display}
        </button>
      ))}
    </div>
  );
}
