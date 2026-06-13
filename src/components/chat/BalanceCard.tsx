"use client";

import { Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CUSD_ADDRESS, CUSD_ABI, shortAddress, formatCUSD } from "@/lib/celo";

export function BalanceCard() {
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: balanceWei, isLoading } = useReadContract({
    address: CUSD_ADDRESS,
    abi: CUSD_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected || !address) {
    return (
      <div className="flex-shrink-0 flex items-center justify-center px-4 py-3 bg-white border-b border-[var(--color-border)]">
        <p className="text-13 text-[var(--color-text-tertiary)]">
          Connect your wallet to get started
        </p>
      </div>
    );
  }

  const balance = balanceWei ? formatCUSD(balanceWei as bigint) : "—";

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "var(--color-primary)" }}
        >
          <span className="text-12 font-bold text-white">$</span>
        </div>
        <div>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-text-tertiary)]" />
          ) : (
            <p className="text-16 font-bold leading-none" style={{ color: "var(--color-primary)" }}>
              {balance} cUSD
            </p>
          )}
          <p className="text-11 text-[var(--color-text-tertiary)] mt-0.5">Available balance</p>
        </div>
      </div>

      <button
        onClick={copyAddress}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-[var(--color-surface-raised)] border border-[var(--color-border)] transition-all hover:bg-[var(--color-border)]"
      >
        <code className="font-mono text-11 text-[var(--color-text-secondary)]">
          {shortAddress(address)}
        </code>
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
        )}
      </button>
    </div>
  );
}
