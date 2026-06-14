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
    <div className="balance-card">
      <div className="balance-label">Total Balance</div>
      <div className="balance-amount mono">{isConnected ? fmt(nativeBal?.value) : "$0.00"}</div>
      {isConnected && shortAddress && (
        <button onClick={copyAddress} className="header-action mx-auto mt-3 bg-[var(--color-surface)]">
          <span className="mono">{shortAddress}</span>
          {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={3} />}
        </button>
      )}
    </div>
  );
}
