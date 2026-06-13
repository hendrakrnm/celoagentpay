"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useReadContracts, useBalance } from "wagmi";
import { useWallet } from "@/lib/wallet";
import { TOKENS } from "@/lib/tokens";

const ERC20_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

function fmt(wei: bigint | undefined): string {
  if (wei === undefined) return "—";
  const n = Number(wei) / 1e18;
  return n < 0.001 ? "0" : n.toFixed(3);
}

export function BalanceCard() {
  const [copied, setCopied] = useState(false);
  const { address, isConnected, shortAddress } = useWallet();

  // Native CELO balance
  const { data: nativeBal } = useBalance({
    address,
    query: { enabled: !!address },
  });

  // ERC20 balances (cUSD, cEUR, cREAL) in one multicall
  const erc20Tokens = [TOKENS.cUSD, TOKENS.cEUR, TOKENS.cREAL];
  const { data: erc20Results } = useReadContracts({
    contracts: erc20Tokens.map((t) => ({
      address: t.address!,
      abi: ERC20_BALANCE_ABI,
      functionName: "balanceOf" as const,
      args: [address!] as [`0x${string}`],
    })),
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

  const balances = [
    { symbol: "CELO", emoji: "🟡", value: nativeBal?.value },
    ...erc20Tokens.map((t, i) => ({
      symbol: t.symbol,
      emoji: t.emoji,
      value: erc20Results?.[i]?.result as bigint | undefined,
    })),
  ];

  return (
    <div className="flex-shrink-0 bg-white border-b border-[var(--color-border)]">
      {/* Token balances row */}
      <div className="flex items-center gap-3 px-4 pt-2 pb-1 overflow-x-auto scrollbar-hide">
        {balances.map(({ symbol, emoji, value }) => (
          <div
            key={symbol}
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-[var(--color-surface-raised)] border border-[var(--color-border)]"
          >
            <span className="text-12">{emoji}</span>
            <span className="text-13 font-semibold" style={{ color: "var(--color-primary)" }}>
              {fmt(value)}
            </span>
            <span className="text-11 text-[var(--color-text-tertiary)]">{symbol}</span>
          </div>
        ))}
      </div>

      {/* Address row */}
      <div className="flex items-center justify-end px-4 pb-2">
        <button
          onClick={copyAddress}
          className="flex items-center gap-1.5 px-2 py-1 rounded-[6px] hover:bg-[var(--color-surface-raised)] transition-colors"
        >
          <code className="font-mono text-11 text-[var(--color-text-tertiary)]">
            {shortAddress}
          </code>
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-[var(--color-text-tertiary)]" />
          )}
        </button>
      </div>
    </div>
  );
}
