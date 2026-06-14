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
    <div className="message-wrapper agent">
      <div className="message-bubble">Got it! Review the transaction details below before we blast off.</div>
      <div className="tx-card">
        <div className="tx-row">
          <span className="tx-label">Action</span>
          <span className="tx-value">{action}</span>
        </div>
        {Object.entries(details).map(([key, value]) => {
          if (value === undefined || value === null) return null;

          return (
            <div className="tx-row" key={key}>
              <span className="tx-label">{key}</span>
              <span className="tx-value mono">{formatValue(key, value)}</span>
            </div>
          );
        })}
        <div className="tx-row">
          <span className="tx-label">Fee</span>
          <span className="tx-value mono">~0.001 CELO</span>
        </div>
        <div className="tx-action-row">
          <button className="tx-cancel" onClick={onCancel} disabled={isLoading}>Cancel</button>
          <button className="tx-action" onClick={onApprove} disabled={isLoading}>{isLoading ? "Confirming..." : "Confirm & Send"}</button>
        </div>
      </div>
    </div>
  );
}
