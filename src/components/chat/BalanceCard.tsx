"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: number;
  address: string;
}

export function BalanceCard({ balance, address }: BalanceCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div
      className="
        sticky top-14 z-20 mx-4 mt-4 p-4
        rounded-[14px] border
        bg-[var(--color-primary-light)]
        border-[rgba(29,158,117,0.2)]
      "
    >
      <p className="text-12 text-[var(--color-text-secondary)] font-medium mb-1">
        Your balance
      </p>
      <p className="text-32 font-medium text-[var(--color-primary-dark)] mb-3">
        ${balance.toFixed(2)}{" "}
        <span className="text-16 text-[var(--color-text-secondary)]">
          cUSD
        </span>
      </p>
      <button
        onClick={copyAddress}
        className="
          flex items-center gap-2
          text-12 font-medium
          text-[var(--color-text-secondary)]
          hover:text-[var(--color-text-primary)]
          transition-colors duration-150
        "
      >
        <code className="font-mono">{shortAddress}</code>
        {copied ? (
          <Check className="w-4 h-4 text-[var(--color-success)]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
