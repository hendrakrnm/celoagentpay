"use client";

import React from "react";
import { Button } from "@/components/ui";
import { CheckCircle } from "lucide-react";

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

export function TxConfirmCard({ action, details, onCancel, onApprove, isLoading = false }: TxConfirmCardProps) {
  return (
    <div className="memphis-card animate-success-pop mx-4 my-4 overflow-hidden bg-[var(--color-surface)] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[var(--border-color)] bg-[var(--color-accent)]">
          <CheckCircle className="h-6 w-6 text-[var(--border-color)]" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Review transaction</p>
          <p className="text-lg font-black uppercase text-[var(--color-text-primary)]">{action}</p>
        </div>
      </div>

      <div className="mb-4 border-y-[3px] border-dashed border-[var(--border-color)]">
        {Object.entries(details).map(([key, value]) => {
          if (value === undefined || value === null) return null;
          const isAddress = String(value).startsWith("0x");
          const display = isAddress ? `${String(value).slice(0, 6)}...${String(value).slice(-4)}` : value;
          return (
            <div key={key} className="flex items-start justify-between gap-4 border-b-2 border-dashed border-[var(--border-color)] px-1 py-3 last:border-b-0">
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--color-text-secondary)]">{key}</span>
              <span className={`max-w-[60%] text-right text-sm font-bold text-[var(--color-text-primary)] ${isAddress ? "mono" : ""}`}>{display}</span>
            </div>
          );
        })}
      </div>

      <p className="mb-4 text-center text-xs font-semibold text-[var(--color-text-secondary)]">
        Please review details carefully before confirming.
      </p>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" fullWidth onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" fullWidth onClick={onApprove} loading={isLoading} disabled={isLoading}>
          {isLoading ? "Confirming" : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
