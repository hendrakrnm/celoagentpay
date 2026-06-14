"use client";

const chips = [
  { label: "Send payment", display: "Send" },
  { label: "Receive", display: "Receive" },
  { label: "Swap", display: "Swap" },
  { label: "Check balance", display: "History" },
];

interface QuickChipsProps {
  onSelect: (chip: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  return (
    <div className="quick-actions">
      {chips.map((chip) => (
        <button key={chip.label} className="chip" onClick={() => onSelect(chip.label)}>
          {chip.display}
        </button>
      ))}
    </div>
  );
}
