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

export function TxConfirmCard({
  action,
  details,
  onCancel,
  onApprove,
  isLoading = false,
}: TxConfirmCardProps) {
  return (
    <div
      className="
        mx-4 my-4 p-5
        rounded-[20px] border border-[var(--color-border)]
        bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-raised)]
        shadow-[var(--shadow-lg)]
        animate-success-pop
        relative overflow-hidden
      "
    >
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-transparent" />

      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <p className="text-12 text-[var(--color-text-tertiary)] font-medium">
            Review Transaction
          </p>
          <p className="text-14 font-bold text-[var(--color-text-primary)]">
            {action}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)] mb-4" />

      {/* Details */}
      <div className="space-y-3 mb-4">
        {Object.entries(details).map(([key, value]) => {
          if (value === undefined || value === null) return null;

          const isAddress = String(value).startsWith("0x");
          const formatKey = key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <div
              key={key}
              className="flex justify-between items-center gap-4 px-2"
            >
              <div>
                <p className="text-12 text-[var(--color-text-tertiary)] font-medium">
                  {formatKey}
                </p>
              </div>
              <div
                className={`
                  text-14 font-bold text-[var(--color-text-primary)]
                  text-right
                  px-3 py-2 rounded-[10px]
                  bg-[var(--color-surface-raised)]
                  ${isAddress ? "font-mono text-12" : ""}
                `}
              >
                {isAddress ? (
                  <code>{`${String(value).slice(0, 6)}...${String(value).slice(-4)}`}</code>
                ) : key === "amount" ? (
                  <span className="text-[var(--color-primary)]">
                    {`${Number(value).toFixed(2)}`}
                    <span className="text-11 text-[var(--color-text-secondary)] ml-1">
                      cUSD
                    </span>
                  </span>
                ) : (
                  value
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)] mb-4" />

      {/* Warning */}
      <p className="text-11 text-[var(--color-text-tertiary)] text-center mb-4 px-2">
        Please review the details carefully before confirming this transaction.
      </p>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onApprove}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Confirming..." : "Confirm →"}
        </Button>
      </div>
    </div>
  );
}
