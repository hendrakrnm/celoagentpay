"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useBalance } from "wagmi";
import { useWallet } from "@/lib/wallet";

function fmt(wei: bigint | undefined): string {
  if (wei === undefined) return "$0.00";
  const n = Number(wei) / 1e18;
  return `${n < 0.001 ? "0.00" : n.toFixed(2)} CELO`;
}

export function BalanceCard() {
  const [copied, setCopied] = useState(false);
  const { address, isConnected, shortAddress } = useWallet();
  const { data: nativeBal } = useBalance({ address, query: { enabled: !!address } });

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sticky top-16 z-20 flex-shrink-0 border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-6 text-center">
      <div className="text-sm font-semibold uppercase tracking-[1px] text-[var(--color-text-secondary)]">Total Balance</div>
      <div className="mono mt-1 text-4xl font-bold text-[var(--color-primary)] [text-shadow:2px_2px_0_var(--border-color)]">
        {isConnected ? fmt(nativeBal?.value) : "$0.00"}
      </div>
      {isConnected && shortAddress && (
        <button
          onClick={copyAddress}
          className="mx-auto mt-3 flex items-center gap-2 rounded-[12px] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]"
        >
          <span className="mono">{shortAddress}</span>
          {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={3} />}
        </button>
      )}
    </div>
  );
}
