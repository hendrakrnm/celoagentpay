"use client";

interface TxConfirmCardProps {
  action: string;
  details: {
    to?: string;
    amount?: number;
    fee?: string;
    memo?: string;
    [key: string]: string | number | undefined;
  };
  onCancel: () => void;
  onApprove: () => void;
  isLoading?: boolean;
}

function formatValue(key: string, value: string | number): string {
  const raw = String(value);
  if (raw.startsWith("0x")) return `${raw.slice(0, 4)}...${raw.slice(-4)}`;
  if (key.toLowerCase() === "amount" && typeof value === "number") return value.toFixed(2);
  return raw;
}

export function TxConfirmCard({ action, details, onCancel, onApprove, isLoading = false }: TxConfirmCardProps) {
  return (
    <div className="flex max-w-[85%] flex-col self-start">
      <div className="rounded-[12px_12px_12px_0] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-[18px] py-3.5 text-sm font-medium leading-normal text-[var(--color-text-primary)] shadow-[var(--shadow-offset)]">
        Got it! Review the transaction details below before we blast off.
      </div>
      <div className="mt-3 overflow-hidden rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-surface)] shadow-[var(--shadow-offset)]">
        <div className="flex justify-between gap-4 border-b-2 border-dashed border-[var(--border-color)] px-4 py-3">
          <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Action</span>
          <span className="text-right text-sm font-semibold">{action}</span>
        </div>
        {Object.entries(details).map(([key, value]) => {
          if (value === undefined || value === null) return null;
          return (
            <div key={key} className="flex justify-between gap-4 border-b-2 border-dashed border-[var(--border-color)] px-4 py-3">
              <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">{key}</span>
              <span className="mono text-right text-sm font-semibold">{formatValue(key, value)}</span>
            </div>
          );
        })}
        <div className="flex justify-between gap-4 border-b-2 border-dashed border-[var(--border-color)] px-4 py-3">
          <span className="text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Fee</span>
          <span className="mono text-right text-sm font-semibold">~0.001 CELO</span>
        </div>
        <div className="grid grid-cols-[1fr_1.3fr] border-t-[3px] border-[var(--border-color)]">
          <button className="border-r-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-3.5 text-center text-[15px] font-bold text-[var(--border-color)]" onClick={onCancel} disabled={isLoading}>Cancel</button>
          <button className="bg-[var(--color-secondary)] px-4 py-3.5 text-center text-base font-bold text-[var(--color-surface)]" onClick={onApprove} disabled={isLoading}>{isLoading ? "Confirming..." : "Confirm & Send"}</button>
        </div>
      </div>
    </div>
  );
}
