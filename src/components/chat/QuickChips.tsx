"use client";

const chips = [
  { label: "Send payment", display: "Send", className: "chip primary" },
  { label: "Receive", display: "Receive", className: "chip secondary" },
  { label: "Swap", display: "Swap", className: "chip accent" },
  { label: "Check balance", display: "History", className: "chip" },
];

interface QuickChipsProps {
  onSelect: (chip: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  return (
    <div className="quick-actions">
      {chips.map((chip) => (
        <button key={chip.label} className={chip.className} onClick={() => onSelect(chip.label)}>
          {chip.display}
        </button>
      ))}
    </div>
  );
}
