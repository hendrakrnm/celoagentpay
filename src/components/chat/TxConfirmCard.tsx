"use client";

import React from "react";
import { Button } from "@/components/ui";

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
        mx-4 my-3 p-4
        rounded-[14px] border border-[var(--color-border-strong)]
        bg-[var(--color-surface)]
        border-l-4 border-l-[var(--color-primary)]
        animate-success-pop
      "
    >
      {/* Title */}
      <h3 className="text-14 font-medium text-[var(--color-text-primary)] mb-3">
        {action}
      </h3>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)] mb-3" />

      {/* Details */}
      <div className="space-y-2 mb-3">
        {Object.entries(details).map(([key, value]) => {
          if (value === undefined || value === null) return null;

          const isAddress = String(value).startsWith("0x");
          const formatKey = key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <div
              key={key}
              className="flex justify-between items-start gap-4"
            >
              <span className="text-12 text-[var(--color-text-tertiary)] font-medium">
                {formatKey}
              </span>
              <span
                className={`
                  text-14 font-medium text-[var(--color-text-primary)]
                  text-right
                  ${isAddress ? "font-mono text-13" : ""}
                `}
              >
                {isAddress ? (
                  <code>{`${String(value).slice(0, 6)}...${String(value).slice(-4)}`}</code>
                ) : key === "amount" ? (
                  `${Number(value).toFixed(2)} cUSD`
                ) : (
                  value
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)] mb-4" />

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          variant="ghost"
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
          Approve →
        </Button>
      </div>
    </div>
  );
}
