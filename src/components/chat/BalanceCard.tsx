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

  const { data: nativeBal } = useBalance({
    address,
    query: { enabled: !!address },
  });

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
      <div className="flex-shrink-0 border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Connect wallet to view balances</p>
      </div>
    );
  }

  const balances = [
    { symbol: "CELO", emoji: "CELO", value: nativeBal?.value },
    ...erc20Tokens.map((t, i) => ({
      symbol: t.symbol,
      emoji: t.emoji,
      value: erc20Results?.[i]?.result as bigint | undefined,
    })),
  ];

  return (
    <div className="flex-shrink-0 border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-5 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Total Balance</p>
      <p className="mono mt-1 text-4xl font-bold text-[var(--color-primary)] [text-shadow:2px_2px_0_var(--border-color)]">
        {fmt(nativeBal?.value)} CELO
      </p>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {balances.map(({ symbol, emoji, value }) => (
          <div key={symbol} className="memphis-card flex flex-shrink-0 items-center gap-2 px-3 py-2 text-sm">
            <span>{emoji}</span>
            <span className="mono text-[var(--border-color)]">{fmt(value)}</span>
            <span className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">{symbol}</span>
          </div>
        ))}
      </div>
      <button onClick={copyAddress} className="mx-auto mt-3 flex items-center gap-1.5 rounded-[8px] border-2 border-[var(--border-color)] bg-[var(--color-accent)] px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_var(--border-color)]">
        <code className="mono">{shortAddress}</code>
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}
