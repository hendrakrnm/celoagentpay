"use client";

import { Copy, Check, Wallet } from "lucide-react";
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
  const avatarColor = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
  ][Math.floor(Math.random() * 4)];

  return (
    <div
      className="
        sticky top-14 z-20 mx-4 mt-4 mb-2 p-4
        rounded-[16px] border border-[var(--color-border)]
        bg-gradient-to-br from-[var(--color-primary-light)] via-[var(--color-surface)] to-[var(--color-surface)]
        shadow-[var(--shadow-md)]
        backdrop-blur-sm
      "
    >
      {/* Header with avatar */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-16 shadow-[var(--shadow-md)]`}
        >
          <Wallet className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-12 text-[var(--color-text-tertiary)] font-medium">
            Your Wallet
          </p>
          <p className="text-14 font-medium text-[var(--color-text-primary)]">
            Celo Account
          </p>
        </div>
      </div>

      {/* Balance Display */}
      <div className="mb-4">
        <p className="text-12 text-[var(--color-text-secondary)] font-medium mb-1">
          Available Balance
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-32 font-bold text-[var(--color-primary-dark)]">
            ${balance.toFixed(2)}
          </p>
          <span className="text-14 font-medium text-[var(--color-primary)]">
            cUSD
          </span>
        </div>
      </div>

      {/* Address Copy */}
      <button
        onClick={copyAddress}
        className="
          w-full flex items-center justify-between gap-2
          px-3 py-2 rounded-[10px]
          bg-[var(--color-surface-raised)] hover:bg-[var(--color-border-strong)]
          transition-all duration-150
          border border-[var(--color-border)]
        "
      >
        <code className="font-mono text-12 text-[var(--color-text-secondary)]">
          {shortAddress}
        </code>
        {copied ? (
          <div className="flex items-center gap-1 text-[var(--color-success)]">
            <Check className="w-4 h-4" />
            <span className="text-11 font-medium">Copied!</span>
          </div>
        ) : (
          <Copy className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        )}
      </button>
    </div>
  );
}
