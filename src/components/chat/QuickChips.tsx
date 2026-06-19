"use client";

const chips = [
  { label: "send", display: "Send", className: "chip primary" },
  { label: "receive", display: "Receive", className: "chip secondary" },
  { label: "swap", display: "Swap", className: "chip accent" },
  { label: "history", display: "History", className: "chip" },
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
